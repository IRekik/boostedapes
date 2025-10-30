document.getElementById("btn").onclick = async () => {
  const r = await fetch("/api/hello/");
  const j = await r.json();
  document.getElementById("out").textContent = JSON.stringify(j, null, 2);
};