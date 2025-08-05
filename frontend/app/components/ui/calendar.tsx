
import { DayPicker, type DayPickerProps, } from "react-day-picker"
import "react-day-picker/style.css"

function Calendar({
  ...props
}: DayPickerProps) {
  return (
    <DayPicker {...props} />
  )
}

export { Calendar }



