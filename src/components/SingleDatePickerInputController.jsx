import React from 'react';
import moment from 'moment';

import { SingleDatePickerInputPhrases } from '../defaultPhrases';

import SingleDatePickerInput from './SingleDatePickerInput';

import toMomentObject from '../utils/toMomentObject';
import toLocalizedDateString from '../utils/toLocalizedDateString';

import isInclusivelyAfterDay from '../utils/isInclusivelyAfterDay';

import {
  ICON_BEFORE_POSITION,
  OPEN_DOWN,
} from '../constants';

const defaultProps = {
  children: null,

  date: null,
  focused: false,

  placeholder: '',
  ariaLabel: undefined,
  titleText: undefined,
  screenReaderMessage: 'Date',
  showClearDate: false,
  showCaret: false,
  showDefaultInputIcon: false,
  inputIconPosition: ICON_BEFORE_POSITION,
  disabled: false,
  required: false,
  readOnly: false,
  openDirection: OPEN_DOWN,
  noBorder: false,
  block: false,
  small: false,
  regular: false,
  verticalSpacing: undefined,

  keepOpenOnDateSelect: false,
  reopenPickerOnClearDate: false,
  isOutsideRange: (day) => !isInclusivelyAfterDay(day, moment()),
  isDayBlocked: () => false,
  displayFormat: () => moment.localeData().longDateFormat('L'),

  onClose() {},
  onKeyDownArrowDown() {},
  onKeyDownQuestionMark() {},

  customInputIcon: null,
  customCloseIcon: null,

  // accessibility
  isFocused: false,

  // i18n
  phrases: SingleDatePickerInputPhrases,

  isRTL: false,
};

export default class SingleDatePickerInputController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onClearFocus = this.onClearFocus.bind(this);
    this.clearDate = this.clearDate.bind(this);
  }

  onChange(dateString) {
    const {
      isOutsideRange,
      isDayBlocked,
      keepOpenOnDateSelect,
      onDateChange,
      onFocusChange,
      onClose,
    } = this.props;
    const newDate = toMomentObject(dateString, this.getDisplayFormat());

    const isValid = newDate && !isOutsideRange(newDate) && !isDayBlocked(newDate);
    if (isValid) {
      onDateChange(newDate);
      if (!keepOpenOnDateSelect) {
        onFocusChange({ focused: false });
        onClose({ date: newDate });
      }
    } else {
      onDateChange(null);
    }
  }

  onFocus() {
    const {
      onFocusChange,
      disabled,
    } = this.props;

    if (!disabled) {
      onFocusChange({ focused: true });
    }
  }

  onClearFocus() {
    const {
      focused,
      onFocusChange,
      onClose,
      date,
    } = this.props;
    if (!focused) return;

    onFocusChange({ focused: false });
    onClose({ date });
  }

  getDisplayFormat() {
    const { displayFormat } = this.props;
    return typeof displayFormat === 'string' ? displayFormat : displayFormat();
  }

  getDateString(date) {
    const displayFormat = this.getDisplayFormat();
    if (date && displayFormat) {
      return date && date.format(displayFormat);
    }
    return toLocalizedDateString(date);
  }

  clearDate() {
    const { onDateChange, reopenPickerOnClearDate, onFocusChange } = this.props;
    onDateChange(null);
    if (reopenPickerOnClearDate) {
      onFocusChange({ focused: true });
    }
  }

  render() {
    const {
      children,
      id,
      placeholder,
      ariaLabel,
      titleText,
      disabled,
      focused,
      isFocused,
      required,
      readOnly,
      openDirection,
      showClearDate,
      showCaret,
      showDefaultInputIcon,
      inputIconPosition,
      customCloseIcon,
      customInputIcon,
      date,
      phrases,
      onKeyDownArrowDown,
      onKeyDownQuestionMark,
      screenReaderMessage,
      isRTL,
      noBorder,
      block,
      small,
      regular,
      verticalSpacing,
    } = this.props;

    const displayValue = this.getDateString(date);

    return (
      <SingleDatePickerInput
        id={id}
        placeholder={placeholder}
        ariaLabel={ariaLabel}
        titleText={titleText}
        focused={focused}
        isFocused={isFocused}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        openDirection={openDirection}
        showCaret={showCaret}
        onClearDate={this.clearDate}
        showClearDate={showClearDate}
        showDefaultInputIcon={showDefaultInputIcon}
        inputIconPosition={inputIconPosition}
        customCloseIcon={customCloseIcon}
        customInputIcon={customInputIcon}
        displayValue={displayValue}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onKeyDownShiftTab={this.onClearFocus}
        onKeyDownArrowDown={onKeyDownArrowDown}
        onKeyDownQuestionMark={onKeyDownQuestionMark}
        screenReaderMessage={screenReaderMessage}
        phrases={phrases}
        isRTL={isRTL}
        noBorder={noBorder}
        block={block}
        small={small}
        regular={regular}
        verticalSpacing={verticalSpacing}
      >
        {children}
      </SingleDatePickerInput>
    );
  }
}

SingleDatePickerInputController.defaultProps = defaultProps;
