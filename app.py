from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import webbrowser

ROOT = Path(__file__).resolve().parent
PORT = 8000

PROFILE = {
    "qualification": "Harsh Kumar is pursuing B.Tech from LNCT&S, Bhopal in Computer Science Engineering, Cyber Security branch. He is currently in 4th semester / 2nd year.",
    "skills": "Skills: C++, JavaScript, HTML, CSS, Python, SQL, MySQL, Docker, Kubernetes, Burp Suite, Blender 3D, GitHub, and GitLab.",
    "learning": "Currently learning DSA, bug bounty, TryHackMe, and What The Hack.",
    "contact": "Email: harrshdev52@gmail.com | Phone: +91 9456321455 | GitHub: github.com/harshsingh | LinkedIn: linkedin.com/in/harshsingh",
    "projects": "Current project focus: bug bounty notes, TryHackMe labs, and Python security scripts.",
}


def answer(question: str) -> str:
    q = question.lower()
    if any(word in q for word in ["qualification", "education", "college", "semester", "year"]):
        return PROFILE["qualification"]
    if any(word in q for word in ["skill", "tech", "stack", "know"]):
        return PROFILE["skills"]
    if any(word in q for word in ["learn", "bug", "tryhackme", "hack"]):
        return PROFILE["learning"]
    if any(word in q for word in ["contact", "email", "phone", "mobile", "github", "linkedin"]):
        return PROFILE["contact"]
    if any(word in q for word in ["project", "work"]):
        return PROFILE["projects"]
    return "Ask about qualification, skills, learning, projects, contact, or GitHub."


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path != "/api/chat":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", 0))
        payload = json.loads(self.rfile.read(length) or b"{}")
        response = {"answer": answer(str(payload.get("question", "")))}
        data = json.dumps(response).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("localhost", PORT), Handler)
    url = f"http://localhost:{PORT}"
    print(f"Portfolio running at {url}")
    webbrowser.open(url)
    server.serve_forever()
