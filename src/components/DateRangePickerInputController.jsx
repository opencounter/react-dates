import React from 'react';
import moment from 'moment';

import { DateRangePickerInputPhrases } from '../defaultPhrases';

import DateRangePickerInput from './DateRangePickerInput';

import toMomentObject from '../utils/toMomentObject';
import toLocalizedDateString from '../utils/toLocalizedDateString';

import isInclusivelyAfterDay from '../utils/isInclusivelyAfterDay';
import isBeforeDay from '../utils/isBeforeDay';

import {
  START_DATE,
  END_DATE,
  ICON_BEFORE_POSITION,
  OPEN_DOWN,
} from '../constants';

const defaultProps = {
  children: null,

  startDate: null,
  startDateId: START_DATE,
  startDatePlaceholderText: 'Start Date',
  isStartDateFocused: false,
  startDateAriaLabel: undefined,
  startDateTitleText: undefined,

  endDate: null,
  endDateId: END_DATE,
  endDatePlaceholderText: 'End Date',
  isEndDateFocused: false,
  endDateAriaLabel: undefined,
  endDateTitleText: undefined,

  screenReaderMessage: '',
  showClearDates: false,
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
  reopenPickerOnClearDates: false,
  withFullScreenPortal: false,
  minimumNights: 1,
  isOutsideRange: (day) => !isInclusivelyAfterDay(day, moment()),
  isDayBlocked: () => false,
  displayFormat: () => moment.localeData().longDateFormat('L'),

  onFocusChange() {},
  onClose() {},
  onDatesChange() {},
  onKeyDownArrowDown() {},
  onKeyDownQuestionMark() {},

  customInputIcon: null,
  customArrowIcon: null,
  customCloseIcon: null,

  // accessibility
  isFocused: false,

  // i18n
  phrases: DateRangePickerInputPhrases,

  isRTL: false,
};

export default class DateRangePickerInputController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClearFocus = this.onClearFocus.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onStartDateFocus = this.onStartDateFocus.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onEndDateFocus = this.onEndDateFocus.bind(this);
    this.clearDates = this.clearDates.bind(this);
  }

  onClearFocus() {
    const {
      onFocusChange,
      onClose,
      startDate,
      endDate,
    } = this.props;

    onFocusChange(null);
    onClose({ startDate, endDate });
  }

  onEndDateChange(endDateString) {
    const {
      startDate,
      isOutsideRange,
      isDayBlocked,
      minimumNights,
      keepOpenOnDateSelect,
      onDatesChange,
    } = this.props;

    const endDate = toMomentObject(endDateString, this.getDisplayFormat());

    const isEndDateValid = endDate
      && !isOutsideRange(endDate) && !isDayBlocked(endDate)
      && !(startDate && isBeforeDay(endDate, startDate.clone().add(minimumNights, 'days')));
    if (isEndDateValid) {
      onDatesChange({ startDate, endDate });
      if (!keepOpenOnDateSelect) this.onClearFocus();
    } else {
      onDatesChange({
        startDate,
        endDate: null,
      });
    }
  }

  onEndDateFocus() {
    const {
      startDate,
      onFocusChange,
      withFullScreenPortal,
      disabled,
    } = this.props;

    if (!startDate && withFullScreenPortal && (!disabled || disabled === END_DATE)) {
      // When the datepicker is full screen, we never want to focus the end date first
      // because there's no indication that that is the case once the datepicker is open and it
      // might confuse the user
      onFocusChange(START_DATE);
    } else if (!disabled || disabled === START_DATE) {
      onFocusChange(END_DATE);
    }
  }

  onStartDateChange(startDateString) {
    let { endDate } = this.props;
    const {
      isOutsideRange,
      isDayBlocked,
      minimumNights,
      onDatesChange,
      onFocusChange,
      disabled,
    } = this.props;

    const startDate = toMomentObject(startDateString, this.getDisplayFormat());
    const isEndDateBeforeStartDate = startDate
      && isBeforeDay(endDate, startDate.clone().add(minimumNights, 'days'));
    const isStartDateValid = startDate
      && !isOutsideRange(startDate) && !isDayBlocked(startDate)
      && !(disabled === END_DATE && isEndDateBeforeStartDate);

    if (isStartDateValid) {
      if (isEndDateBeforeStartDate) {
        endDate = null;
      }

      onDatesChange({ startDate, endDate });
      onFocusChange(END_DATE);
    } else {
      onDatesChange({
        startDate: null,
        endDate,
      });
    }
  }

  onStartDateFocus() {
    const { disabled, onFocusChange } = this.props;

    if (!disabled || disabled === END_DATE) {
      onFocusChange(START_DATE);
    }
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

  clearDates() {
    const { onDatesChange, reopenPickerOnClearDates, onFocusChange } = this.props;
    onDatesChange({ startDate: null, endDate: null });
    if (reopenPickerOnClearDates) {
      onFocusChange(START_DATE);
    }
  }

  render() {
    const {
      children,
      startDate,
      startDateId,
      startDatePlaceholderText,
      isStartDateFocused,
      startDateAriaLabel,
      startDateTitleText,
      endDate,
      endDateId,
      endDatePlaceholderText,
      endDateAriaLabel,
      endDateTitleText,
      isEndDateFocused,
      screenReaderMessage,
      showClearDates,
      showCaret,
      showDefaultInputIcon,
      inputIconPosition,
      customInputIcon,
      customArrowIcon,
      customCloseIcon,
      disabled,
      required,
      readOnly,
      openDirection,
      isFocused,
      phrases,
      onKeyDownArrowDown,
      onKeyDownQuestionMark,
      isRTL,
      noBorder,
      block,
      small,
      regular,
      verticalSpacing,
    } = this.props;

    const startDateString = this.getDateString(startDate);
    const endDateString = this.getDateString(endDate);

    return (
      <DateRangePickerInput
        startDate={startDateString}
        startDateId={startDateId}
        startDatePlaceholderText={startDatePlaceholderText}
        isStartDateFocused={isStartDateFocused}
        startDateAriaLabel={startDateAriaLabel}
        startDateTitleText={startDateTitleText}
        endDate={endDateString}
        endDateId={endDateId}
        endDatePlaceholderText={endDatePlaceholderText}
        isEndDateFocused={isEndDateFocused}
        endDateAriaLabel={endDateAriaLabel}
        endDateTitleText={endDateTitleText}
        isFocused={isFocused}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        openDirection={openDirection}
        showCaret={showCaret}
        showDefaultInputIcon={showDefaultInputIcon}
        inputIconPosition={inputIconPosition}
        customInputIcon={customInputIcon}
        customArrowIcon={customArrowIcon}
        customCloseIcon={customCloseIcon}
        phrases={phrases}
        onStartDateChange={this.onStartDateChange}
        onStartDateFocus={this.onStartDateFocus}
        onStartDateShiftTab={this.onClearFocus}
        onEndDateChange={this.onEndDateChange}
        onEndDateFocus={this.onEndDateFocus}
        showClearDates={showClearDates}
        onClearDates={this.clearDates}
        screenReaderMessage={screenReaderMessage}
        onKeyDownArrowDown={onKeyDownArrowDown}
        onKeyDownQuestionMark={onKeyDownQuestionMark}
        isRTL={isRTL}
        noBorder={noBorder}
        block={block}
        small={small}
        regular={regular}
        verticalSpacing={verticalSpacing}
      >
        {children}
      </DateRangePickerInput>
    );
  }
}

DateRangePickerInputController.defaultProps = defaultProps;
