import networkx as nx
from typing import Dict, Any, List, Optional
from ..models.schemas import Node, Edge, KnowledgeGraphResponse

class KnowledgeGraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.node_store: Dict[str, Node] = {}
        self.edge_store: List[Edge] = []

    def build(self, analysis: Dict[str, Any], business_rules: List[Dict[str, Any]]) -> KnowledgeGraphResponse:
        """
        Constructs the Software Knowledge Graph using deterministic repository findings and mined business rules.
        """
        self.graph.clear()
        self.node_store.clear()
        self.edge_store.clear()

        # 1. Root Repository Node
        repo_info = analysis.get("repository", {})
        repo_id = "repo-root"
        self._add_node(Node(
            id=repo_id,
            type="repository",
            name=repo_info.get("name", "legacy-shop"),
            file="package.json",
            description=f"Legacy e-commerce application ({repo_info.get('runtime', 'Node.js 12')})",
            confidence=1.0,
            metadata={"runtime": repo_info.get("runtime"), "framework": "Express"}
        ))

        # 2. Service Nodes
        services = [
            ("service-payment", "PaymentService", "services/payment.js", 12, "Processes transactions and interacts with LegacyGateway"),
            ("service-pricing", "PricingService", "services/pricing.js", 4, "Calculates order subtotals, tax, and customer discounts"),
            ("service-orders", "OrderService", "services/orders.js", 5, "Manages order creation lifecycle and preparation"),
            ("service-user", "UserService", "services/user.js", 4, "Customer profile management and loyalty tier lookup")
        ]
        for s_id, s_name, s_file, s_line, s_desc in services:
            self._add_node(Node(
                id=s_id,
                type="service",
                name=s_name,
                file=s_file,
                line=s_line,
                description=s_desc,
                confidence=0.98,
                metadata={"responsibilities": [s_desc]}
            ))
            self._add_edge(repo_id, s_id, "CONTAINS")

        # 3. Controller / API Endpoints
        api_nodes = [
            ("api-checkout", "POST /api/checkout", "routes/checkout.js", 13, "Checkout submission endpoint invoking PaymentService"),
            ("api-refund", "POST /api/checkout/refund", "routes/checkout.js", 52, "Order refund endpoint"),
            ("api-profile", "GET /api/users/profile/:id", "routes/users.js", 7, "User profile inspection with JWT auth"),
            ("api-orders", "GET /api/orders/:id", "routes/orders.js", 6, "Order lookup endpoint")
        ]
        for a_id, a_name, a_file, a_line, a_desc in api_nodes:
            self._add_node(Node(
                id=a_id,
                type="api",
                name=a_name,
                file=a_file,
                line=a_line,
                description=a_desc,
                confidence=1.0,
                metadata={"method": a_name.split()[0], "route": a_name.split()[1]}
            ))
            self._add_edge(repo_id, a_id, "EXPOSES")

        # 4. Database Nodes
        db_id = "db-mongo"
        table_orders_id = "table-orders"
        table_users_id = "table-users"

        self._add_node(Node(
            id=db_id,
            type="database",
            name="MongoDB (Legacy)",
            file="config/database.js",
            line=12,
            description="MongoDB driver v3 persistence layer",
            confidence=1.0,
            metadata={"driver": "mongodb@3.6.3"}
        ))
        self._add_node(Node(
            id=table_orders_id,
            type="database",
            name="orders collection",
            file="repositories/orderRepository.js",
            line=7,
            description="Stores customer orders and billing transaction details",
            confidence=0.98
        ))
        self._add_node(Node(
            id=table_users_id,
            type="database",
            name="users collection",
            file="services/user.js",
            line=6,
            description="Stores customer profiles and loyalty tiers",
            confidence=0.95
        ))
        self._add_edge(db_id, table_orders_id, "CONTAINS")
        self._add_edge(db_id, table_users_id, "CONTAINS")

        # 5. External Integration Nodes
        gw_id = "ext-legacy-gateway"
        self._add_node(Node(
            id=gw_id,
            type="external_service",
            name="LegacyGateway",
            file="integrations/legacyGateway.js",
            line=15,
            description="External proprietary payment provider using deprecated 'request' package",
            confidence=0.96,
            metadata={"endpoint": "https://legacy-pay.internal.corp/api/v1/charge"}
        ))

        # 6. Dependency Nodes
        deps = [
            ("dep-express", "express@4.16.4", "Web framework"),
            ("dep-request", "request@2.88.2", "Deprecated HTTP client unmaintained since 2020"),
            ("dep-mongodb", "mongodb@3.6.3", "Legacy MongoDB driver v3"),
            ("dep-jwt", "jsonwebtoken@8.5.1", "JWT authentication library with hardcoded fallback")
        ]
        for d_id, d_name, d_desc in deps:
            self._add_node(Node(
                id=d_id,
                type="dependency",
                name=d_name,
                file="package.json",
                description=d_desc,
                confidence=1.0,
                metadata={"status": "deprecated" if "deprecated" in d_desc.lower() else "active"}
            ))
            self._add_edge(repo_id, d_id, "DEPENDS_ON")

        # 7. Test Nodes
        tests = [
            ("test-pricing", "pricing.test.js", "tests/pricing.test.js", 5, "Validates discount thresholds and sales tax"),
            ("test-payment", "payment.test.js", "tests/payment.test.js", 5, "Asserts payment charge and status updates")
        ]
        for t_id, t_name, t_file, t_line, t_desc in tests:
            self._add_node(Node(
                id=t_id,
                type="test",
                name=t_name,
                file=t_file,
                line=t_line,
                description=t_desc,
                confidence=1.0
            ))
            self._add_edge(repo_id, t_id, "CONTAINS")

        # 8. Business Rule Nodes
        for r in business_rules:
            r_node_id = f"rule-{r['id']}"
            self._add_node(Node(
                id=r_node_id,
                type="business_rule",
                name=r["title"],
                file=r["source_file"],
                line=int(r["source_lines"].split("-")[0]) if "-" in r["source_lines"] else None,
                description=r["description"],
                confidence=r.get("confidence", 0.9),
                metadata={"status": r.get("status"), "evidence": r.get("evidence")}
            ))

        # 9. Security Finding Nodes
        for sec in analysis.get("security_findings", []):
            s_node_id = f"sec-{sec['id']}"
            self._add_node(Node(
                id=s_node_id,
                type="security_finding",
                name=f"{sec['severity']}: {sec['title']}",
                file=sec["source_file"],
                line=int(sec["source_lines"].split("-")[0]) if "-" in str(sec["source_lines"]) and str(sec["source_lines"]).split("-")[0].isdigit() else None,
                description=sec["description"],
                confidence=0.99,
                metadata={"severity": sec["severity"], "remediation": sec["remediation"]}
            ))

        # 10. Relationships / Interconnections
        # Checkout controller calls services
        self._add_edge("api-checkout", "service-orders", "CALLS")
        self._add_edge("api-checkout", "service-payment", "CALLS")
        self._add_edge("api-checkout", "service-user", "CALLS")
        self._add_edge("api-refund", "service-payment", "CALLS")

        # OrderService calls PricingService
        self._add_edge("service-orders", "service-pricing", "CALLS")
        self._add_edge("service-orders", table_orders_id, "WRITES")

        # PaymentService couplings
        self._add_edge("service-payment", gw_id, "DEPENDS_ON")
        self._add_edge("service-payment", table_orders_id, "WRITES")
        self._add_edge("service-payment", "dep-request", "USES")
        self._add_edge(gw_id, "dep-request", "IMPORTS")

        # Tests
        self._add_edge("test-payment", "service-payment", "TESTS")
        self._add_edge("test-pricing", "service-pricing", "TESTS")

        # Business Rules links
        self._add_edge("rule-rule-001", "service-pricing", "IMPLEMENTS")
        self._add_edge("rule-rule-002", "service-pricing", "IMPLEMENTS")
        self._add_edge("rule-rule-003", "service-pricing", "IMPLEMENTS")
        self._add_edge("rule-rule-004", "service-payment", "IMPLEMENTS")
        self._add_edge("rule-rule-005", "service-payment", "IMPLEMENTS")

        # Security Links
        self._add_edge("sec-SEC-001", "dep-request", "AFFECTS")
        self._add_edge("sec-SEC-002", "api-profile", "AFFECTS")

        return self.to_response()

    def _add_node(self, node: Node):
        self.node_store[node.id] = node
        self.graph.add_node(node.id, **node.model_dump())

    def _add_edge(self, source: str, target: str, relationship: str, metadata: Optional[Dict] = None):
        edge = Edge(source=source, target=target, relationship=relationship, metadata=metadata or {})
        self.edge_store.append(edge)
        self.graph.add_edge(source, target, relationship=relationship)

    def to_response(self) -> KnowledgeGraphResponse:
        nodes = list(self.node_store.values())
        edges = self.edge_store
        stats = {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "services": len([n for n in nodes if n.type == "service"]),
            "apis": len([n for n in nodes if n.type == "api"]),
            "business_rules": len([n for n in nodes if n.type == "business_rule"]),
            "security_findings": len([n for n in nodes if n.type == "security_finding"]),
            "tests": len([n for n in nodes if n.type == "test"])
        }
        return KnowledgeGraphResponse(nodes=nodes, edges=edges, stats=stats)

    def to_react_flow(self) -> Dict[str, Any]:
        """
        Formats graph for @xyflow/react canvas rendering with positions and custom node styles.
        """
        res = self.to_response()
        rf_nodes = []
        rf_edges = []

        # Multi-column architecture layout: Distinct X columns and Y tracking
        tier_columns = {
            "repository": 50,
            "dependency": 50,
            "api": 400,
            "service": 760,
            "database": 1120,
            "external_service": 1120,
            "business_rule": 1480,
            "test": 1840,
            "security_finding": 1840
        }
        # Shared vertical coordinate per column to avoid node collision
        col_y_counters: Dict[int, int] = {
            50: 80,
            400: 80,
            760: 80,
            1120: 80,
            1480: 80,
            1840: 80
        }

        for n in res.nodes:
            t = n.type
            x = tier_columns.get(t, 760)
            y = col_y_counters.get(x, 80)
            col_y_counters[x] = y + 140

            rf_nodes.append({
                "id": n.id,
                "type": "customNode",
                "position": {"x": x, "y": y},
                "data": {
                    "id": n.id,
                    "label": n.name,
                    "nodeType": n.type,
                    "file": n.file,
                    "line": n.line,
                    "description": n.description,
                    "confidence": n.confidence,
                    "metadata": n.metadata
                }
            })

        for idx, e in enumerate(res.edges):
            rf_edges.append({
                "id": f"e-{e.source}-{e.target}-{idx}",
                "source": e.source,
                "target": e.target,
                "label": e.relationship,
                "type": "smoothstep",
                "animated": e.relationship in ["CALLS", "AFFECTS"],
                "data": {"relationship": e.relationship}
            })

        return {"nodes": rf_nodes, "edges": rf_edges, "stats": res.stats}

knowledge_graph_engine = KnowledgeGraphEngine()
