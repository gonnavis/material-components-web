/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *      http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import MDCComponent from '@material/base/component';

import {MDCTabScrollerAdapter} from './adapter';
import MDCTabScrollerFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCTabScrollerFoundation>}
 * @final
 */
class MDCTabScroller extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCTabScroller}
   */
  static attachTo(root) {
    return new MDCTabScroller(root);
  }

  constructor(...args) {
    super(...args);

    /** @private {?Element} */
    this.content_;

    /** @private {?Element} */
    this.area_;

    /** @private {?function(?Event): undefined} */
    this.handleInteraction_;

    /** @private {?function(!Event): undefined} */
    this.handleTransitionEnd_;
  }

  initialize() {
    this.area_ = this.root_.querySelector(MDCTabScrollerFoundation.strings.AREA_SELECTOR);
    this.content_ = this.root_.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR);
  }

  initialSyncWithDOM() {
    this.handleInteraction_ = () => this.foundation_.handleInteraction();
    this.handleTransitionEnd_ = (evt) => this.foundation_.handleTransitionEnd(evt);

    this.area_.addEventListener('wheel', this.handleInteraction_);
    this.area_.addEventListener('touchstart', this.handleInteraction_);
    this.area_.addEventListener('pointerdown', this.handleInteraction_);
    this.area_.addEventListener('mousedown', this.handleInteraction_);
    this.area_.addEventListener('keydown', this.handleInteraction_);
    this.content_.addEventListener('transitionend', this.handleTransitionEnd_);
  }

  destroy() {
    super.destroy();

    this.area_.removeEventListener('wheel', this.handleInteraction_);
    this.area_.removeEventListener('touchstart', this.handleInteraction_);
    this.area_.removeEventListener('pointerdown', this.handleInteraction_);
    this.area_.removeEventListener('mousedown', this.handleInteraction_);
    this.area_.removeEventListener('keydown', this.handleInteraction_);
    this.content_.removeEventListener('transitionend', this.handleTransitionEnd_);
  }

  /**
   * @return {!MDCTabScrollerFoundation}
   */
  getDefaultFoundation() {
    const adapter = /** @type {!MDCTabScrollerAdapter} */ ({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      eventTargetMatchesSelector: (evtTarget, className) => {
        let matches = Element.prototype.matches;
        if (matches === undefined) {
          matches = Element.prototype.msMatchesSelector;
        }
        return matches.call(evtTarget, className);
      },
      setScrollContentStyleProperty: (prop, value) => this.content_.style.setProperty(prop, value),
      getScrollContentStyleValue: (propName) => window.getComputedStyle(this.content_).getPropertyValue(propName),
      setScrollAreaScrollLeft: (scrollX) => this.area_.scrollLeft = scrollX,
      getScrollAreaScrollLeft: () => this.area_.scrollLeft,
      getScrollContentOffsetWidth: () => this.content_.offsetWidth,
      getScrollAreaOffsetWidth: () => this.area_.offsetWidth,
      computeScrollAreaClientRect: () => this.area_.getBoundingClientRect(),
      computeScrollContentClientRect: () => this.content_.getBoundingClientRect(),
    });

    return new MDCTabScrollerFoundation(adapter);
  }

  /**
   * Returns the current visual scroll position
   * @return {number}
   */
  getScrollPosition() {
    return this.foundation_.getScrollPosition();
  }

  /**
   * Increments the scroll value by the given amount
   * @param {number} scrollXIncrement The pixel value by which to increment the scroll value
   */
  incrementScroll(scrollXIncrement) {
    this.foundation_.incrementScroll(scrollXIncrement);
  }

  /**
   * Scrolls to the given pixel position
   * @param {number} scrollX The pixel value to scroll to
   */
  scrollTo(scrollX) {
    this.foundation_.scrollTo(scrollX);
  }
}

export {MDCTabScroller, MDCTabScrollerFoundation};
