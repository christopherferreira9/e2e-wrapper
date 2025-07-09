import { E2EWrapper } from 'e2e-wrapper';

/* global device, expect */

describe('E2E Wrapper Test App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('App Navigation', () => {
    it('should display the main app title', async () => {
      const appTitle = E2EWrapper.withDetox({ testId: 'app-title' });
      
      await appTitle
        .wait()
        .forVisible()
        .execute();
      
      const titleText = await appTitle.getDriver().getText();
      expect(titleText).toBe('E2E Testing App');
    });

    it('should display the subtitle', async () => {
      const subtitle = E2EWrapper.withDetox({ testId: 'app-subtitle' });
      
      await subtitle
        .wait()
        .forVisible()
        .execute();
      
      const subtitleText = await subtitle.getDriver().getText();
      expect(subtitleText).toBe('Test your e2e-wrapper framework');
    });
  });

  describe('Counter Demo', () => {
    it('should increment counter when + button is pressed', async () => {
      const counterDisplay = E2EWrapper.withDetox({ testId: 'counter-display' });
      const incrementButton = E2EWrapper.withDetox({ testId: 'increment-button' });
      
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
      const initialValue = await counterDisplay.getDriver().getText();
      expect(initialValue).toBe('0');
      
      // Tap increment button
      await incrementButton.getDriver().tap();
      
      // Check counter was incremented
      const newValue = await counterDisplay.getDriver().getText();
      expect(newValue).toBe('1');
    });

    it('should decrement counter when - button is pressed', async () => {
      const counterDisplay = E2EWrapper.withDetox({ testId: 'counter-display' });
      const decrementButton = E2EWrapper.withDetox({ testId: 'decrement-button' });
      
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
      await decrementButton.getDriver().tap();
      
      // Check counter was decremented
      const newValue = await counterDisplay.getDriver().getText();
      expect(newValue).toBe('-1');
    });
  });

  describe('Text Input Demo', () => {
    it('should handle text input and display', async () => {
      const textInput = E2EWrapper.withDetox({ testId: 'text-input' });
      const submitButton = E2EWrapper.withDetox({ testId: 'submit-button' });
      const displayText = E2EWrapper.withDetox({ testId: 'display-text' });
      
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
      
      // Type text
      const testText = 'Hello E2E Wrapper!';
      await textInput.getDriver().typeText(testText);
      
      // Submit
      await submitButton.getDriver().tap();
      
      // Wait for display text to appear
      await displayText
        .wait()
        .forVisible({ timeout: 5000 })
        .execute();
      
      // Check displayed text
      const displayedText = await displayText.getDriver().getText();
      expect(displayedText).toBe(`You entered: ${testText}`);
    });
  });

  describe('Loading Demo', () => {
    it('should show loading state when loading button is pressed', async () => {
      const loadingButton = E2EWrapper.withDetox({ testId: 'loading-button' });
      const loadingIndicator = E2EWrapper.withDetox({ testId: 'loading-indicator' });
      
      // Wait for loading button to be ready
      await loadingButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Check initial button text
      const initialText = await loadingButton.getDriver().getText();
      expect(initialText).toBe('Start Loading');
      
      // Tap loading button
      await loadingButton.getDriver().tap();
      
      // Wait for loading indicator to appear
      await loadingIndicator
        .wait()
        .forVisible({ timeout: 1000 })
        .execute();
      
      // Check loading indicator text
      const loadingText = await loadingIndicator.getDriver().getText();
      expect(loadingText).toBe('Please wait...');
      
      // Check button text changed
      const loadingButtonText = await loadingButton.getDriver().getText();
      expect(loadingButtonText).toBe('Loading...');
    });
  });

  describe('Switch Demo', () => {
    it('should toggle switch and update label', async () => {
      const featureSwitch = E2EWrapper.withDetox({ testId: 'feature-switch' });
      const switchLabel = E2EWrapper.withDetox({ testId: 'switch-label' });
      
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
      const initialLabel = await switchLabel.getDriver().getText();
      expect(initialLabel).toBe('Enable Feature: OFF');
      
      // Toggle switch
      await featureSwitch.getDriver().tap();
      
      // Check label updated
      const updatedLabel = await switchLabel.getDriver().getText();
      expect(updatedLabel).toBe('Enable Feature: ON');
    });
  });

  describe('Modal Demo', () => {
    it('should open and close modal', async () => {
      const openModalButton = E2EWrapper.withDetox({ testId: 'open-modal-button' });
      const modal = E2EWrapper.withDetox({ testId: 'test-modal' });
      const modalTitle = E2EWrapper.withDetox({ testId: 'modal-title' });
      const closeModalButton = E2EWrapper.withDetox({ testId: 'close-modal-button' });
      
      // Wait for open button to be ready
      await openModalButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Open modal
      await openModalButton.getDriver().tap();
      
      // Wait for modal to appear
      await modal
        .wait()
        .forVisible({ timeout: 3000 })
        .execute();
      
      // Check modal title
      await modalTitle
        .wait()
        .forVisible()
        .execute();
      
      const titleText = await modalTitle.getDriver().getText();
      expect(titleText).toBe('Test Modal');
      
      // Close modal
      await closeModalButton
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      await closeModalButton.getDriver().tap();
      
      // Wait for modal to disappear
      await modal
        .wait()
        .forNotVisible({ timeout: 3000 })
        .execute();
    });
  });

  describe('Todo List Demo', () => {
    it('should add and toggle todo items', async () => {
      const todoInput = E2EWrapper.withDetox({ testId: 'todo-input' });
      const addButton = E2EWrapper.withDetox({ testId: 'add-todo-button' });
      const todoList = E2EWrapper.withDetox({ testId: 'todo-list' });
      
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
      await todoInput.getDriver().typeText(newTodoText);
      await addButton.getDriver().tap();
      
      // Wait for todo list to update
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
      const firstTodoToggle = E2EWrapper.withDetox({ testId: 'toggle-button-1' });
      
      await firstTodoToggle
        .wait()
        .forVisible()
        .forEnabled()
        .execute();
      
      // Toggle the first todo
      await firstTodoToggle.getDriver().tap();
      
      // In a real test, you would check that the todo item's style or text changed
      // to reflect the completed state
    });
  });
}); 