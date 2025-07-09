/* global device */
import { E2EWrapper, IE2EWrapper, ScrollDirection } from 'e2e-wrapper';
import jestExpect from 'expect';

describe('Scroll Functionality Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should scroll down to find an element', async () => {
    // Try to find the Modal Demo section which should be lower on the page
    const modalSection: IE2EWrapper = E2EWrapper.withDetox({ testId: 'modal-demo-section' });
    
    // Use scrollTo to find the modal section
    await modalSection
      .scrollTo({
        direction: ScrollDirection.DOWN,
        timeout: 5000,
        scrollAmount: 0.5,
      })
      .execute();
    
    // Verify the element is now visible
    const isVisible = await modalSection.isVisible();
    jestExpect(isVisible).toBe(true);
  });

  it('should scroll to find the todo list section', async () => {
    // Try to find the Todo List section which should be at the bottom
    const todoSection: IE2EWrapper = E2EWrapper.withDetox({ testId: 'todo-list-section' });
    
    // Use scrollTo with custom options
    await todoSection
      .scrollTo({
        direction: ScrollDirection.DOWN,
        timeout: 8000,
        interval: 300,
        scrollAmount: 0.5 // Scroll 50% of screen each time
      })
      .execute();
    
    // Verify the element is now visible
    const isVisible = await todoSection.isVisible();
    jestExpect(isVisible).toBe(true);
  });

  it('should scroll back up to find the counter section', async () => {
    // First scroll down to bottom
    const todoSection: IE2EWrapper = E2EWrapper.withDetox({ testId: 'todo-list-section' });
    await todoSection.scrollTo({ direction: ScrollDirection.DOWN }).execute();
    
    // Now scroll back up to find the counter section
    const counterSection: IE2EWrapper = E2EWrapper.withDetox({ testId: 'counter-demo-section' });
    
    await counterSection
      .scrollTo({
        direction: ScrollDirection.UP,
        timeout: 5000
      })
      .execute();
    
    // Verify the element is now visible
    const isVisible = await counterSection.isVisible();
    jestExpect(isVisible).toBe(true);
  });

  it('should use chained scrollTo with interaction', async () => {
    // Scroll to the modal demo section
    const openModalButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'open-modal-button' });
    
    // Scroll to the element and then interact with it
    await openModalButton
      .scrollTo({ direction: ScrollDirection.DOWN })
      .execute();
    
    // Now tap the button since it's visible
    await openModalButton.tap();
    
    // Verify modal opened
    const modal: IE2EWrapper = E2EWrapper.withDetox({ testId: 'test-modal' });
    await modal.wait().forVisible({ timeout: 3000 }).execute();
    
    const isModalVisible = await modal.isVisible();
    jestExpect(isModalVisible).toBe(true);
    
    // Close modal
    const closeButton: IE2EWrapper = E2EWrapper.withDetox({ testId: 'close-modal-button' });
    await closeButton.tap();
  });
}); 