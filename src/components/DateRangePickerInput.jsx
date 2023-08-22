import React from 'react';
import { css, withStyles } from 'react-with-styles';

import { DateRangePickerInputPhrases } from '../defaultPhrases';
import noflip from '../utils/noflip';

import DateInput from './DateInput';

import RightArrow from './RightArrow';
import LeftArrow from './LeftArrow';
import CloseButton from './CloseButton';
import CalendarIcon from './CalendarIcon';

import {
  START_DATE,
  END_DATE,
  ICON_BEFORE_POSITION,
  ICON_AFTER_POSITION,
  OPEN_DOWN,
} from '../constants';

const defaultProps = {
  children: null,
  startDateId: START_DATE,
  endDateId: END_DATE,
  startDatePlaceholderText: 'Start Date',
  endDatePlaceholderText: 'End Date',
  startDateAriaLabel: undefined,
  endDateAriaLabel: undefined,
  startDateTitleText: undefined,
  endDateTitleText: undefined,
  screenReaderMessage: '',
  onStartDateFocus() {},
  onEndDateFocus() {},
  onStartDateChange() {},
  onEndDateChange() {},
  onStartDateShiftTab() {},
  onEndDateTab() {},
  onClearDates() {},
  onKeyDownArrowDown() {},
  onKeyDownQuestionMark() {},

  startDate: '',
  endDate: '',

  isStartDateFocused: false,
  isEndDateFocused: false,
  showClearDates: false,
  disabled: false,
  required: false,
  readOnly: false,
  openDirection: OPEN_DOWN,
  showCaret: false,
  showDefaultInputIcon: false,
  inputIconPosition: ICON_BEFORE_POSITION,
  customInputIcon: null,
  customArrowIcon: null,
  customCloseIcon: null,
  noBorder: false,
  block: false,
  small: false,
  regular: false,
  verticalSpacing: undefined,

  // accessibility
  isFocused: false,

  // i18n
  phrases: DateRangePickerInputPhrases,

  isRTL: false,
};

function DateRangePickerInput({
  children,
  startDate,
  startDateId,
  startDatePlaceholderText,
  screenReaderMessage,
  isStartDateFocused,
  onStartDateChange,
  onStartDateFocus,
  onStartDateShiftTab,
  startDateAriaLabel,
  startDateTitleText,
  endDate,
  endDateId,
  endDatePlaceholderText,
  isEndDateFocused,
  onEndDateChange,
  onEndDateFocus,
  onEndDateTab,
  endDateAriaLabel,
  endDateTitleText,
  onKeyDownArrowDown,
  onKeyDownQuestionMark,
  onClearDates,
  showClearDates,
  disabled,
  required,
  readOnly,
  showCaret,
  openDirection,
  showDefaultInputIcon,
  inputIconPosition,
  customInputIcon,
  customArrowIcon,
  customCloseIcon,
  isFocused,
  phrases,
  isRTL,
  noBorder,
  block,
  verticalSpacing,
  small,
  regular,
  styles,
}) {
  const calendarIcon = customInputIcon || (
    <CalendarIcon {...css(styles.DateRangePickerInput_calendarIcon_svg)} />
  );

  let arrowIcon = customArrowIcon || <RightArrow {...css(styles.DateRangePickerInput_arrow_svg)} />;
  if (isRTL) arrowIcon = <LeftArrow {...css(styles.DateRangePickerInput_arrow_svg)} />;
  if (small) arrowIcon = '-';

  const closeIcon = customCloseIcon || (
    <CloseButton
      {...css(
        styles.DateRangePickerInput_clearDates_svg,
        small && styles.DateRangePickerInput_clearDates_svg__small,
      )}
    />
  );

  const screenReaderStartDateText = screenReaderMessage
    || phrases.keyboardForwardNavigationInstructions;
  const screenReaderEndDateText = screenReaderMessage
    || phrases.keyboardBackwardNavigationInstructions;

  const inputIcon = (showDefaultInputIcon || customInputIcon !== null) && (
    <button
      {...css(styles.DateRangePickerInput_calendarIcon)}
      type="button"
      disabled={disabled}
      aria-label={phrases.focusStartDate}
      onClick={onKeyDownArrowDown}
    >
      {calendarIcon}
    </button>
  );

  const startDateDisabled = disabled === START_DATE || disabled === true;
  const endDateDisabled = disabled === END_DATE || disabled === true;

  return (
    <div
      {...css(
        styles.DateRangePickerInput,
        disabled && styles.DateRangePickerInput__disabled,
        isRTL && styles.DateRangePickerInput__rtl,
        !noBorder && styles.DateRangePickerInput__withBorder,
        block && styles.DateRangePickerInput__block,
        showClearDates && styles.DateRangePickerInput__showClearDates,
      )}
    >
      {inputIconPosition === ICON_BEFORE_POSITION && inputIcon}

      <DateInput
        id={startDateId}
        placeholder={startDatePlaceholderText}
        ariaLabel={startDateAriaLabel}
        titleText={startDateTitleText}
        displayValue={startDate}
        screenReaderMessage={screenReaderStartDateText}
        focused={isStartDateFocused}
        isFocused={isFocused}
        disabled={startDateDisabled}
        required={required}
        readOnly={readOnly}
        showCaret={showCaret}
        openDirection={openDirection}
        onChange={onStartDateChange}
        onFocus={onStartDateFocus}
        onKeyDownShiftTab={onStartDateShiftTab}
        onKeyDownArrowDown={onKeyDownArrowDown}
        onKeyDownQuestionMark={onKeyDownQuestionMark}
        verticalSpacing={verticalSpacing}
        small={small}
        regular={regular}
      />

      {children}

      {
        <div
          {...css(styles.DateRangePickerInput_arrow)}
          aria-hidden="true"
          role="presentation"
        >
          {arrowIcon}
        </div>
      }

      <DateInput
        id={endDateId}
        placeholder={endDatePlaceholderText}
        ariaLabel={endDateAriaLabel}
        titleText={endDateTitleText}
        displayValue={endDate}
        screenReaderMessage={screenReaderEndDateText}
        focused={isEndDateFocused}
        isFocused={isFocused}
        disabled={endDateDisabled}
        required={required}
        readOnly={readOnly}
        showCaret={showCaret}
        openDirection={openDirection}
        onChange={onEndDateChange}
        onFocus={onEndDateFocus}
        onKeyDownArrowDown={onKeyDownArrowDown}
        onKeyDownQuestionMark={onKeyDownQuestionMark}
        onKeyDownTab={onEndDateTab}
        verticalSpacing={verticalSpacing}
        small={small}
        regular={regular}
      />

      {showClearDates && (
        <button
          type="button"
          aria-label={phrases.clearDates}
          {...css(
            styles.DateRangePickerInput_clearDates,
            small && styles.DateRangePickerInput_clearDates__small,
            !customCloseIcon && styles.DateRangePickerInput_clearDates_default,
            !(startDate || endDate) && styles.DateRangePickerInput_clearDates__hide,
          )}
          onClick={onClearDates}
          disabled={disabled}
        >
          {closeIcon}
        </button>
      )}

      {inputIconPosition === ICON_AFTER_POSITION && inputIcon}
    </div>
  );
}

DateRangePickerInput.defaultProps = defaultProps;

export default withStyles(({ reactDates: { border, color, sizing } }) => ({
  DateRangePickerInput: {
    backgroundColor: color.background,
    display: 'inline-block',
  },

  DateRangePickerInput__disabled: {
    background: color.disabled,
  },

  DateRangePickerInput__withBorder: {
    borderColor: color.border,
    borderWidth: border.pickerInput.borderWidth,
    borderStyle: border.pickerInput.borderStyle,
    borderRadius: border.pickerInput.borderRadius,
  },

  DateRangePickerInput__rtl: {
    direction: noflip('rtl'),
  },

  DateRangePickerInput__block: {
    display: 'block',
  },

  DateRangePickerInput__showClearDates: {
    paddingRight: 30, // TODO: should be noflip wrapped and handled by an isRTL prop
  },

  DateRangePickerInput_arrow: {
    display: 'inline-block',
    verticalAlign: 'middle',
    color: color.text,
  },

  DateRangePickerInput_arrow_svg: {
    verticalAlign: 'middle',
    fill: color.text,
    height: sizing.arrowWidth,
    width: sizing.arrowWidth,
  },

  DateRangePickerInput_clearDates: {
    background: 'none',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',

    cursor: 'pointer',
    padding: 10,
    margin: '0 10px 0 5px', // TODO: should be noflip wrapped and handled by an isRTL prop
    position: 'absolute',
    right: 0, // TODO: should be noflip wrapped and handled by an isRTL prop
    top: '50%',
    transform: 'translateY(-50%)',
  },

  DateRangePickerInput_clearDates__small: {
    padding: 6,
  },

  DateRangePickerInput_clearDates_default: {
    ':focus': {
      background: color.core.border,
      borderRadius: '50%',
    },

    ':hover': {
      background: color.core.border,
      borderRadius: '50%',
    },
  },

  DateRangePickerInput_clearDates__hide: {
    visibility: 'hidden',
  },

  DateRangePickerInput_clearDates_svg: {
    fill: color.core.grayLight,
    height: 12,
    width: 15,
    verticalAlign: 'middle',
  },

  DateRangePickerInput_clearDates_svg__small: {
    height: 9,
  },

  DateRangePickerInput_calendarIcon: {
    background: 'none',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',

    cursor: 'pointer',
    display: 'inline-block',
    verticalAlign: 'middle',
    padding: 10,
    margin: '0 5px 0 10px', // TODO: should be noflip wrapped and handled by an isRTL prop
  },

  DateRangePickerInput_calendarIcon_svg: {
    fill: color.core.grayLight,
    height: 15,
    width: 14,
    verticalAlign: 'middle',
  },
}), { pureComponent: typeof React.PureComponent !== 'undefined' })(DateRangePickerInput);
