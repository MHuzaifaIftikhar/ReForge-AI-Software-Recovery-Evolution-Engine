import sys
import os
from pathlib import Path

try:
    from dulwich.repo import Repo
    import dulwich.porcelain as dp
except ImportError:
    print("Error: dulwich library not found. Run: pip install dulwich")
    sys.exit(1)

def main():
    repo_path = Path(__file__).resolve().parent.parent
    repo = Repo(str(repo_path))

    token = os.environ.get("GITHUB_TOKEN")
    if len(sys.argv) > 1:
        token = sys.argv[1].strip()

    remote_url = "https://github.com/MHuzaifaIftikhar/ReForge-AI-Software-Recovery-Evolution-Engine.git"

    if token:
        # Authenticated URL with token
        auth_url = f"https://oauth2:{token}@github.com/MHuzaifaIftikhar/ReForge-AI-Software-Recovery-Evolution-Engine.git"
        print(f"Pushing to {remote_url} using provided token...")
        try:
            dp.push(repo, auth_url, b"refs/heads/main:refs/heads/main", force=True)
            print("Successfully pushed to GitHub!")
            return
        except Exception as e:
            print(f"Push failed: {e}")
            sys.exit(1)
    else:
        print("==================================================")
        print("  HOW TO PUSH REFORGE TO GITHUB")
        print("==================================================")
        print("Option 1: Using your GitHub Personal Access Token (PAT):")
        print("  python scripts/push_to_github.py <YOUR_GITHUB_TOKEN>")
        print()
        print("Option 2: Using standard Git CLI:")
        print("  git push -u origin main")
        print("==================================================")

if __name__ == "__main__":
    main()
