const data = [
  { source: "Darkweb Dump #821", email: "admin@acme.com", password: "password123", username: "admin" },
  { source: "VPC Flow Logs (US-East)", email: null, ip_address: "192.168.1.55" },
  { source: "CISA Alert AA23-xxxA", email: null },
  { source: "Pastebin Credential Leak", email: "johndoe@acme.com", password: "securepassword!" },
  { source: "Telegram Channel 'ExploitHub'", email: "ceo@acme.com", password: "ilovemycompany" },
  { source: "Active Directory Logs", email: null, ip_address: "10.0.0.4" }
];

fetch('http://localhost:3000/api/ingest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log("Response:", data))
.catch(error => console.error("Error:", error));
