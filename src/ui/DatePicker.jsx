import React, { forwardRef, useState } from "react";
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";

const DatePicker = forwardRef(
  ({ label = "Select a Date", name, disabled, error, value, onChange }, popoverRef) => {
    
    const currentYear = new Date().getFullYear();
    const [selectedDate, setSelectedDate] = useState(value || null);
    const [month, setMonth] = useState(
      selectedDate ? selectedDate.getMonth() : new Date().getMonth()
    );
    const [year, setYear] = useState(
      selectedDate ? selectedDate.getFullYear() : currentYear
    );

    const handleDateSelect = (date) => {
      setSelectedDate(date);
      onChange(date);
    };

    const handleMonthChange = (e) => {
      setMonth(e.target.value);
    };

    const handleYearChange = (e) => {
      setYear(e.target.value);
    };

    return (
      <div className="w-full">
        <Popover placement="bottom">
          <PopoverHandler>
            <Input
              color={error ? "red" : "blue"}
              label={label}
              disabled={disabled}
              onChange={() => null}
              value={selectedDate ? format(selectedDate, "PPP") : ""}
              readOnly
            />
          </PopoverHandler>
          <PopoverContent ref={popoverRef} className="z-50">
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between mb-4">
                {/* Month Dropdown */}
                <select
                  value={month}
                  className="focus:outline-none cursor-pointer"
                  onChange={handleMonthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  className="focus:outline-none cursor-pointer"
                  value={year}
                  onChange={handleYearChange}
                >
                  {Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (
                    <option key={i} value={1950 + i}>
                      {1950 + i}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day Picker */}
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                
                month={new Date(year, month)} // Set month and year from dropdowns
                showOutsideDays
                className="border-0"
                classNames={{
                  caption:
                    "flex justify-center py-2 mb-4 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "hidden",
                  table: "w-full border-collapse",
                  head_row: "flex font-medium text-gray-900",
                  head_cell: "m-0.5 w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative",
                  day: "h-9 w-9 p-0 font-normal",
                  day_selected:
                    "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                  day_today: "rounded-md bg-gray-200 text-gray-900",
                  day_outside:
                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                  day_disabled: "text-gray-500 opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;