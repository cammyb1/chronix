import type { ModalInputData, ModalInputItem } from '@/core/types';
import { ButtonElement, DivElement, InputElement, SpanElement } from './BaseUI';

export default class Modal extends DivElement<{ confirm: { data: ModalInputData } }> {
  inputData: ModalInputData = {};
  inputs: ModalInputItem[] = [];

  header: DivElement;
  body: DivElement;
  descElement?: SpanElement;
  inputWrapper: DivElement;

  confirmButton: ButtonElement;
  cancelButton: ButtonElement;

  constructor(title?: string, desc?: string | null, inputs: ModalInputItem[] = []) {
    super();

    this.addClass('modal-container');
    const overlay = new DivElement().addClass('modal-overlay');
    const content = new DivElement().addClass('modal-content');

    const contentHeader = new DivElement().addClass('modal-header');
    const contentBody = new DivElement().addClass('modal-body');
    const contentFooter = new DivElement().addClass('modal-footer');
    const inputWrapper = new DivElement().addClass('modal-inputs');

    const cancelButton = new ButtonElement()
      .addClass('modal-button', 'dark')
      .setTextContent('Cancel');
    const confirmButton = new ButtonElement().addClass('modal-button').setTextContent('Confirm');

    contentFooter.add(cancelButton);
    contentFooter.add(confirmButton);

    contentBody.add(inputWrapper);
    content.add(contentHeader);
    content.add(contentBody);
    content.add(contentFooter);

    confirmButton.on('click', () => {
      this.trigger('confirm', { data: this.inputData });
    });

    cancelButton.on('click', () => this.close());
    overlay.dom.addEventListener('click', () => this.close());

    this.add(overlay);
    this.add(content);

    this.inputWrapper = inputWrapper;
    this.confirmButton = confirmButton;
    this.cancelButton = cancelButton;
    this.header = contentHeader;
    this.body = contentBody;

    if (title) {
      this.setTitle(title);
    }

    if (desc) {
      this.setDesc(desc);
    }

    if (inputs) {
      this.setInputs(inputs);
    }
  }

  setTitle(text: string): this {
    this.header.setTextContent(text);
    return this;
  }

  setDesc(text: string): this {
    if (this.descElement) {
      this.descElement.setTextContent(text);
    } else {
      this.descElement = new SpanElement().setTextContent(text);
      this.body.add(this.descElement);
    }
    return this;
  }

  setInputs(inputs: ModalInputItem[] = []): this {
    this.inputs = inputs;
    return this;
  }

  setCancelButtonText(text: string): this {
    this.cancelButton.setTextContent(text);
    return this;
  }

  setConfirmButtonText(text: string): this {
    this.confirmButton.setTextContent(text);
    return this;
  }

  refreshInputs() {
    this.inputData = {};
    this.inputWrapper.clear();

    this.inputs.forEach((inputData) => {
      const inputWrapper = new DivElement().addClass('modal-input-wrapper');
      const label = new DivElement()
        .addClass('modal-input-label')
        .setTextContent(`${inputData.label}:`);
      const input = new InputElement(inputData.type).addClass('track-input');
      input.dom.value = inputData.placeHolder;

      if (inputData.type === 'number' && (inputData.min || inputData.max)) {
        if (inputData.min) {
          input.addAttribute('min', inputData.min);
        }
        if (inputData.max) {
          input.addAttribute('max', inputData.max);
        }
      }

      input.on('change', (e) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === 'number' ? parseFloat(target.value) : target.value;

        this.inputData[inputData.value] = target.type === 'checkbox' ? target.checked : value;
      });

      const value = input.dom.type === 'number' ? parseFloat(input.dom.value) : input.dom.value;

      this.inputData[inputData.value] = input.dom.type === 'checkbox' ? input.dom.checked : value;

      inputWrapper.add(label, input);
      this.inputWrapper.add(inputWrapper);
    });
  }

  open() {
    this.refreshInputs();
    document.body.appendChild(this.dom);
  }

  close() {
    document.body.removeChild(this.dom);
  }
}
