import { E2EWrapper, IE2EWrapper, ScrollDirection } from 'e2e-wrapper';
import jestExpect from 'expect';

/* global device, expect */

describe('E2E Wrapper Test App', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  describe('App Navigation', () => {
    it('should display the main app title', async () => {
      const appTitle: IE2EWrapper = E2EWrapper.withDetox({ testId: 'app-title' });
      
      await appTitle
        .wait()
        .forVisible()
        .execute();
      
      const titleText = await appTitle.getText();
      jestExpect(titleText).toBe('E2E Testing App');
    });

    it('should display the subtitle', async () => {
      const subtitle: IE2EWrapper = E2EWrapper.withDetox({ testId: 'app-subtitle' });
      
      await subtitle
        .wait()
        .forVisible()
        .execute();
      
      const subtitleText = await subtitle.getText();
      jestExpect(subtitleText).toBe('Test your e2e-wrapper framework');
    });
  });

  describe('Counter Demo', () => {
    it('should increment counter when + button is pressed', async () => {
      const counterDisplay: IE2EWrapper = E2EWrapper.withDetox({ testId: 'counter-display' });
      const incrementButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'increment-button' });
      
      // Wait for elements to be visible
      await counterDisplay
        .wait()
        .forVisible()
        .execute();
      
      await incrementButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Check initial counter value
      const initialValue = await counterDisplay.getText();
      jestExpect(initialValue).toBe('0');
      
      // Tap increment button
      await incrementButton.tap();
      
      // Check counter was incremented
      const newValue = await counterDisplay.getText();
      jestExpect(newValue).toBe('1');
    });

    it('should decrement counter when - button is pressed', async () => {
      const counterDisplay: IE2EWrapper = E2EWrapper.withDetox({ testId: 'counter-display' });
      const decrementButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'decrement-button' });
      
      // Wait for elements to be visible
      await counterDisplay
        .wait()
        .forVisible()
        .execute();
      
      await decrementButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Tap decrement button
      await decrementButton.tap();
      
      // Check counter was decremented
      const newValue = await counterDisplay.getText();
      jestExpect(newValue).toBe('0');
    });
  });

  describe('Text Input Demo', () => {
    it('should handle text input and display', async () => {
      const textInput: IE2EWrapper = E2EWrapper.withDetox({ testId: 'text-input' });
      const submitButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'submit-button' });
      const displayText: IE2EWrapper = E2EWrapper.withDetox({ testId: 'display-text' });
      
      // Wait for input to be ready
      await textInput
        .wait()
        .forVisible()
        .execute();
      
      await submitButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Type text (keyboard will be automatically dismissed)
      const testText = 'Hello E2E Wrapper!';
      await textInput.typeText(testText);
      
      // Submit
      await submitButton.tap();
      
      // Wait for display text to appear
      await displayText
        .wait()
        .forVisible({ timeout: 5000 })
        .execute();
      
      // Check displayed text
      const displayedText = await displayText.getText();
      jestExpect(displayedText).toBe(`You entered: ${testText}`);
    });
  });

  describe('Loading Demo', () => {
    it('should show loading state when loading button is pressed', async () => {
      const loadingButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'loading-button' });
      const loadingIndicator: IE2EWrapper = E2EWrapper.withDetox({ testId: 'loading-indicator' });
      
      // Wait for loading button to be ready
      await loadingButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Check initial button text
      const initialText = await loadingButton.getText();
      jestExpect(initialText).toBe('Start Loading');
      
      // Tap loading button
      await loadingButton.tap();
      
      // Wait for loading indicator to appear
      await loadingIndicator
        .wait()
        .forVisible({ timeout: 1000 })
        .execute();
      
      // Check loading indicator text
      const loadingText = await loadingIndicator.getText();
      jestExpect(loadingText).toBe('Please wait...');
      
      // Check button text changed
      const loadingButtonText = await loadingButton.getText();
      jestExpect(loadingButtonText).toBe('Loading...');
      
      // Wait for and dismiss the success alert
      await new Promise(resolve => setTimeout(resolve, 2500)); // Wait for alert to appear
      
      // Dismiss the alert by tapping OK
      const alertOkButton = (global as any).element((global as any).by.text('OK'));
      await alertOkButton.tap();
    });
  });

  describe('Switch Demo', () => {
    it('should toggle switch and update label', async () => {
      const featureSwitch: IE2EWrapper = E2EWrapper.withDetox({ testId: 'feature-switch' });
      const switchLabel: IE2EWrapper = E2EWrapper.withDetox({ testId: 'switch-label' });
      
      // Wait for switch to be ready
      await featureSwitch
        .wait()
        .forVisible()
        .execute();
      
      await switchLabel
        .wait()
        .forVisible()
        .execute();
      
      // Check initial label
      const initialLabel = await switchLabel.getText();
      jestExpect(initialLabel).toBe('Enable Feature: OFF');
      
      // Toggle switch
      await featureSwitch.tap();
      
      // Check label updated
      const updatedLabel = await switchLabel.getText();
      jestExpect(updatedLabel).toBe('Enable Feature: ON');
    });
  });

  describe('Modal Demo', () => {
    it('should open and close modal', async () => {
      const openModalButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'open-modal-button' });
      const modal: IE2EWrapper = E2EWrapper.withDetox({ testId: 'test-modal' });
      const modalTitle: IE2EWrapper = E2EWrapper.withDetox({ testId: 'modal-title' });
      const closeModalButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'close-modal-button' });
      
      await openModalButton.scrollTo({
        direction: ScrollDirection.DOWN,
        timeout: 5000,
        scrollAmount: 0.3, // 30% of screen height
        visibilityThreshold: 0.8, // Element must be 80% visible (set to 0 to disable)
        // useBasicVisibility: true, // Uncomment to force basic visibility check
      }).execute();

      // Wait for open button to be ready
      await openModalButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Open modal
      await openModalButton.tap();
      
      // Check modal title
      await modalTitle
        .wait()
        .forVisible()
        .execute();
      
      const titleText = await modalTitle.getText();
      jestExpect(titleText).toBe('Test Modal');
      
      // Close modal
      await closeModalButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      await closeModalButton.tap();
      
      // Wait for modal to disappear (wait for modal title to disappear)
      await modalTitle
        .wait()
        .forNotVisible({ timeout: 5000 })
        .execute();
    });
  });

  describe('Todo List Demo', () => {
    it('should add and toggle todo items', async () => {
      const todoInput: IE2EWrapper = E2EWrapper.withDetox({ testId: 'todo-input' });
      const addButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'add-todo-button' });
      const todoList: IE2EWrapper = E2EWrapper.withDetox({ testId: 'todo-list' });
      
      // Wait for todo input to be ready
      await todoInput
        .wait()
        .forVisible()
        .execute();
      
      await addButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Add new todo
      const newTodoText = 'Test E2E Wrapper';
      await todoInput.typeText(newTodoText);
      await addButton.tap();
      
      // Wait for todo list to update
      // Scroll until the todoList is substantially visible (70% is reasonable for a list)
      await todoList.scrollTo({ 
        visibilityThreshold: 0.7, // 70% visible is good enough for a list
        centerInViewport: false,   // Don't try to center large lists
        timeout: 5000             // Shorter timeout since it's likely already visible
      }).execute();
      await todoList
        .wait()
        .forVisible()
        .execute();
      
      // Check that new todo appears in the list
      // Note: In a real test, you might need to scroll or use more specific selectors
      // to find the newly added todo item
    });

    it('should toggle existing todo items', async () => {
      // Test with existing todo item
      const firstTodoToggle: IE2EWrapper = E2EWrapper.withDetox({ testId: 'toggle-button-1' });
      
      await firstTodoToggle
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Toggle the first todo
      await firstTodoToggle.tap();
      
      // In a real test, you would check that the todo item's style or text changed
      // to reflect the completed state
    });
  });
}); 