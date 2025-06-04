import ReactDatePicker, {
  DatePickerProps as ReactDatePickerProps,
} from 'react-datepicker';
import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ja } from 'date-fns/locale/ja';

import { i18n } from '../../app/i18n';
import { useTranslation } from 'react-i18next';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

export const DatePicker = (props: ReactDatePickerProps) => {
  const [t] = useTranslation();

  const currentLocale = (): Locale => {
    if (i18n.language === 'ja') {
      return { ...ja, options: { ...ja.options, weekStartsOn: 1 } };
    }
    return { ...enUS, options: { ...enUS.options, weekStartsOn: 1 } };
  };

  const {
    locale = currentLocale(),
    fixedHeight = true,
    isClearable = true,
    todayButton = t('atoms:DatePicker.todayButton'),
    showYearDropdown = true,
    showMonthDropdown = true,
    dropdownMode = 'select',
    dateFormatCalendar = t('atoms:DatePicker.dateFormatCalendar') ?? 'MM/yyyy',
    dateFormat = t('atoms:DatePicker.dateFormat') ?? 'yyyy-MM-dd',
  } = props;

  return (
    <ReactDatePicker
      {...props}
      locale={locale}
      fixedHeight={fixedHeight}
      isClearable={isClearable}
      todayButton={todayButton}
      showYearDropdown={showYearDropdown}
      showMonthDropdown={showMonthDropdown}
      dropdownMode={dropdownMode}
      dateFormatCalendar={dateFormatCalendar}
      dateFormat={dateFormat}
    />
  );
};
