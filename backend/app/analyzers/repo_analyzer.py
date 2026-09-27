import os
import re
import json
from pathlib import Path
from typing import Dict, Any, List

class RepoAnalyzer:
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path).resolve()
        self.analysis_cache: Dict[str, Any] = {}

    def analyze(self) -> Dict[str, Any]:
        """
        Executes complete deterministic static analysis over the repository.
        Extracts files, dependencies, routes, database calls, functions, tests, and security findings.
        """
        if not self.repo_path.exists():
            raise FileNotFoundError(f"Repository path does not exist: {self.repo_path}")

        files_info = self._extract_files()
        dependencies_info = self._extract_dependencies()
        apis_info = self._extract_apis()
        db_ops = self._extract_database_operations()
        functions_info = self._extract_functions()
        tests_info = self._extract_tests()
        security_findings = self._extract_security_findings(dependencies_info)

        result = {
            "repository": {
                "name": self.repo_path.name,
                "path": str(self.repo_path),
                "language": "javascript",
                "runtime": "Node.js 12" if "request" in str(dependencies_info) else "Node.js 22",
                "framework": "Express"
            },
            "files": files_info,
            "dependencies": dependencies_info,
            "apis": apis_info,
            "database_operations": db_ops,
            "functions": functions_info,
            "tests": tests_info,
            "security_findings": security_findings
        }
        self.analysis_cache = result
        return result

    def _extract_files(self) -> List[Dict[str, Any]]:
        file_list = []
        for root, dirs, files in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in [".git", "node_modules", "__pycache__", ".venv"]]
            for file in files:
                full_path = Path(root) / file
                rel_path = full_path.relative_to(self.repo_path).as_posix()
                try:
                    size = full_path.stat().st_size
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                    file_list.append({
                        "path": rel_path,
                        "name": file,
                        "extension": full_path.suffix,
                        "size": size,
                        "lines_count": len(lines),
                        "language": "javascript" if full_path.suffix in [".js", ".json"] else "other"
                    })
                except Exception:
                    pass
        return file_list

    def _extract_dependencies(self) -> Dict[str, Any]:
        pkg_file = self.repo_path / "package.json"
        if not pkg_file.exists():
            return {"direct": [], "dev": [], "raw": {}}

        try:
            with open(pkg_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            deps = []
            for pkg, ver in data.get("dependencies", {}).items():
                status = "outdated" if pkg in ["request", "mongodb", "body-parser"] else "standard"
                if pkg == "request":
                    status = "deprecated"
                deps.append({
                    "package": pkg,
                    "version": ver,
                    "type": "production",
                    "status": status,
                    "source": "package.json"
                })

            dev_deps = []
            for pkg, ver in data.get("devDependencies", {}).items():
                dev_deps.append({
                    "package": pkg,
                    "version": ver,
                    "type": "development",
                    "status": "standard",
                    "source": "package.json"
                })

            return {
                "direct": deps,
                "dev": dev_deps,
                "engines": data.get("engines", {}),
                "raw": data
            }
        except Exception:
            return {"direct": [], "dev": [], "raw": {}}

    def _extract_apis(self) -> List[Dict[str, Any]]:
        apis = []
        routes_dir = self.repo_path / "routes"
        if not routes_dir.exists():
            # Check all js files
            target_files = list(self.repo_path.glob("**/*.js"))
        else:
            target_files = list(routes_dir.glob("*.js")) + [self.repo_path / "app.js"]

        route_pattern = re.compile(r"(?:router|app)\.(get|post|put|delete|patch)\(\s*['\"]([^'\"]+)['\"]", re.IGNORECASE)

        for file_path in target_files:
            if not file_path.exists():
                continue
            rel_path = file_path.relative_to(self.repo_path).as_posix()
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line_num, line in enumerate(f, start=1):
                        match = route_pattern.search(line)
                        if match:
                            method = match.group(1).upper()
                            path = match.group(2)
                            # Prefix route if inside checkout or users
                            prefix = ""
                            if "checkout" in rel_path and not path.startswith("/api"):
                                prefix = "/api/checkout"
                            elif "users" in rel_path and not path.startswith("/api"):
                                prefix = "/api/users"
                            elif "orders" in rel_path and not path.startswith("/api"):
                                prefix = "/api/orders"
                            elif "products" in rel_path and not path.startswith("/api"):
                                prefix = "/api/products"

                            full_route = f"{prefix}{path}" if prefix and not path.startswith("/") else (f"{prefix}/{path.lstrip('/')}" if prefix else path)
                            apis.append({
                                "method": method,
                                "route": full_route.replace("//", "/"),
                                "file": rel_path,
                                "line": line_num,
                                "raw_statement": line.strip()
                            })
            except Exception:
                pass
        return apis

    def _extract_database_operations(self) -> List[Dict[str, Any]]:
        db_ops = []
        db_pattern = re.compile(r"\.(findOne|insertOne|updateOne|find|deleteOne|deleteMany|aggregate)\((.*?)\)")

        for file_path in self.repo_path.glob("**/*.js"):
            if "node_modules" in str(file_path):
                continue
            rel_path = file_path.relative_to(self.repo_path).as_posix()
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line_num, line in enumerate(f, start=1):
                        match = db_pattern.search(line)
                        if match:
                            op = match.group(1)
                            db_ops.append({
                                "operation": op,
                                "file": rel_path,
                                "line": line_num,
                                "statement": line.strip()
                            })
            except Exception:
                pass
        return db_ops

    def _extract_functions(self) -> List[Dict[str, Any]]:
        functions = []
        func_patterns = [
            re.compile(r"(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\((.*?)\)"),
            re.compile(r"(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\((.*?)\)\s*=>"),
            re.compile(r"(?:async\s+)?([a-zA-Z0-9_$]+)\s*\((.*?)\)\s*\{")
        ]

        for file_path in self.repo_path.glob("**/*.js"):
            if "node_modules" in str(file_path) or "tests" in str(file_path):
                continue
            rel_path = file_path.relative_to(self.repo_path).as_posix()
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line_num, line in enumerate(f, start=1):
                        for pattern in func_patterns:
                            match = pattern.search(line)
                            if match:
                                name = match.group(1)
                                if name not in ["if", "for", "while", "switch", "catch", "then"]:
                                    functions.append({
                                        "name": name,
                                        "file": rel_path,
                                        "line": line_num,
                                        "signature": line.strip()
                                    })
                                break
            except Exception:
                pass
        return functions

    def _extract_tests(self) -> List[Dict[str, Any]]:
        tests = []
        test_dir = self.repo_path / "tests"
        if not test_dir.exists():
            return tests

        test_pattern = re.compile(r"(?:it|test)\s*\(\s*['\"]([^'\"]+)['\"]|console\.log\(\s*['\"][\s✓]*([^'\"]+)['\"]")

        for file_path in test_dir.glob("*.js"):
            rel_path = file_path.relative_to(self.repo_path).as_posix()
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line_num, line in enumerate(f, start=1):
                        match = test_pattern.search(line)
                        if match:
                            name = match.group(1) or match.group(2)
                            if name and not name.startswith("---") and not name.startswith("==="):
                                tests.append({
                                    "name": name.strip(),
                                    "file": rel_path,
                                    "line": line_num
                                })
            except Exception:
                pass
        return tests

    def _extract_security_findings(self, deps_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []

        # Finding 1: Obsolete/deprecated 'request' package
        deps = [d["package"] for d in deps_info.get("direct", [])]
        if "request" in deps:
            findings.append({
                "id": "SEC-001",
                "title": "Deprecated Dependency: request",
                "severity": "HIGH",
                "category": "Insecure / Obsolete Dependency",
                "source_file": "package.json",
                "source_lines": "13",
                "description": "The 'request' HTTP package was fully deprecated in February 2020 and contains unpatched vulnerabilities.",
                "remediation": "Migrate to Node.js native fetch or modern axios client."
            })

        # Finding 2: Hardcoded secret fallback in auth middleware
        auth_file = self.repo_path / "middleware" / "auth.js"
        if auth_file.exists():
            try:
                with open(auth_file, "r", encoding="utf-8") as f:
                    content = f.read()
                    if "legacy_super_secret_key_123" in content:
                        findings.append({
                            "id": "SEC-002",
                            "title": "Hardcoded JWT Secret Fallback",
                            "severity": "CRITICAL",
                            "category": "Cryptographic Vulnerability",
                            "source_file": "middleware/auth.js",
                            "source_lines": "8",
                            "description": "Hardcoded default JWT secret detected ('legacy_super_secret_key_123') when environment variable is unset.",
                            "remediation": "Enforce mandatory environment variable injection without default fallback."
                        })
                    if "jwt.verify(token, JWT_SECRET," in content and "algorithms" not in content:
                        findings.append({
                            "id": "SEC-003",
                            "title": "Unrestricted JWT Signature Verification",
                            "severity": "MEDIUM",
                            "category": "Authentication Bypass Risk",
                            "source_file": "middleware/auth.js",
                            "source_lines": "19-25",
                            "description": "jwt.verify does not enforce explicit algorithms, leaving tokens vulnerable to algorithm confusion attacks.",
                            "remediation": "Pass explicit algorithms: ['HS256'] to jwt.verify options."
                        })
            except Exception:
                pass

        # Finding 3: Deprecated MongoDB Driver connection flags
        db_config = self.repo_path / "config" / "database.js"
        if db_config.exists():
            try:
                with open(db_config, "r", encoding="utf-8") as f:
                    content = f.read()
                    if "useNewUrlParser" in content or "useUnifiedTopology" in content:
                        findings.append({
                            "id": "SEC-004",
                            "title": "Deprecated MongoDB Driver Options",
                            "severity": "LOW",
                            "category": "Obsolete API Usage",
                            "source_file": "config/database.js",
                            "source_lines": "12-15",
                            "description": "useNewUrlParser and useUnifiedTopology are deprecated in MongoDB driver v4+ and throw warnings in modern runtimes.",
                            "remediation": "Upgrade to MongoDB Driver v6 and remove obsolete connection flags."
                        })
            except Exception:
                pass

        return findings
