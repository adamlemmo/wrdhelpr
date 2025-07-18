import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initApp } from '../src/main.js'

describe('main.js DOM behavior', () => {
  let userInputField, resultDiv, copyBtn, form;

  beforeEach(() => {
    // Set up minimal HTML structure
    document.body.innerHTML = `
      <form id="userInputForm">
        <input id="userInput" />
        <button type="submit">Submit</button>
      </form>
      <div id="result" style="display: none;"></div>
      <button id="copyBtn" style="display: none;">Copy</button>
    `;

    userInputField = document.getElementById('userInput');
    resultDiv = document.getElementById('result');
    copyBtn = document.getElementById('copyBtn');
    form = document.getElementById('userInputForm');

    initApp(); // initialize your actual app logic
  });

  it('should clean input on keyup', () => {
    userInputField.value = 'abc123!@#';
    userInputField.dispatchEvent(new KeyboardEvent('keyup'));

    expect(userInputField.value).toBe('ABC');
  });

  it('should calculate missing letters on form submit', () => {
    userInputField.value = 'ABCD';

    form.dispatchEvent(new Event('submit'));

    expect(resultDiv.textContent).toContain('E');
    expect(resultDiv.style.display).toBe('block');
    expect(copyBtn.style.display).toBe('inline-block');
  });

  it('should copy result text to clipboard', async () => {
    userInputField.value = 'XYZ';
    form.dispatchEvent(new Event('submit'));

    const fakeWriteText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: fakeWriteText },
      writable: true,
    });

    copyBtn.dispatchEvent(new MouseEvent('click'));

    expect(fakeWriteText).toHaveBeenCalledWith(resultDiv.textContent);
  });
});
