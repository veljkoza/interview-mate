interface IOpenAIQueue {
  queue: Array<() => Promise<void>>;
  processing: boolean;

  addToQueue(fn: () => Promise<void>): Promise<void>;
  processNext(): Promise<void>;
}

export class OpenAIQueue implements IOpenAIQueue {
  queue: Array<() => Promise<void>> = [];
  processing = false;

  async addToQueue(fn: () => Promise<void>) {
    this.queue.push(fn);
    if (this.processing) return;
    this.processing = true;
    await this.processNext();
    this.processing = false;
  }

  async processNext() {
    while (this.queue.length) {
      const nextFunction = this.queue.shift();
      await nextFunction?.();
    }
  }
}
