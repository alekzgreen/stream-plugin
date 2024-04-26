class Counter {
  constructor(data) {
    this.render(data);

    document.body.append(this.el);
  }

  template({ amount = 0 } = {}) {
    return `
      <div class="counter__logo"></div>
      <div class="counter__amount">${amount}</div>
    `;
  }

  render(data = {}) {
    this.el = document.createElement('div');
    this.el.className = 'counter';

    this.el.innerHTML = this.template(data);
    return this.el;
  }

  setAmount({ amount = 0 } = {}) {
    this.el.querySelector('.counter__amount').innerText = amount;
  }
}

class App {
  constructor(channelId) {
    this.channelId = this.getChannelId() || channelId;
    this.counter = new Counter();

    this.init();
  }

  getChannelId() {
    const { searchParams } = new URL(document.location.toString());
    return searchParams.get('id');
  }

  async getSubscribersAmount(channelId = this.channelId) {
    const url = `https://mixerno.space/api/youtube-channel-counter/user/${channelId}`;
    const response = await fetch(url);
    const data = await response.json();
    const { count = 0 } = data.counts?.find(({ value }) => value === 'subscribers') || {};
    return count;
  }

  async update() {
    const amount = await this.getSubscribersAmount();

    this.counter.setAmount({ amount });
  }

  setUpdateInterval() {
    setInterval(() => this.update(), 5000);
  }

  async init() {
    await this.update();

    this.setUpdateInterval();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App('UCX6OQ3DkcsbYNE6H8uQQuVA');
});
