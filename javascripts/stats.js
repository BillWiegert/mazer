class Stats {
  constructor() {
    this.data = this.loadSavedStats();
  }
  //TODO: use local storage instead of cookies

  loadSavedStats() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf('stats=') == 0) {
        const stats = c.substring(name.length, c.length);
        return JSON.parse(stats);
      }
    }
    return {};
  }

  updateStats(level, score, walls) {
    this.data[level].best = score;
    this.data[level].walls = walls;
    stats = JSON.stringify(this.data);
    document.cookie = `stats=${stats}`;
  }

  clearStats() {
    document.cookie = "stats={}";
  }
}

export default Stats;
