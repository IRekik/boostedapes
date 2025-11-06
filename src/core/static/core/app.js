document.getElementById("btn").onclick = async () => {
  const r = await fetch("/api/hello/");
  const j = await r.json();
  document.getElementById("out").textContent = JSON.stringify(j, null, 2);
};

document.getElementById("fetch_games_btn").addEventListener('click', async () => {
  const username = document.getElementById("username").value;
  const tag = document.getElementById("tag").value;
  const r = await fetch(`/api/games/?username=${username}&tag=${tag}`);
  const j = await r.json();

  document.getElementById("out2").textContent = JSON.stringify(j, null, 2);
})