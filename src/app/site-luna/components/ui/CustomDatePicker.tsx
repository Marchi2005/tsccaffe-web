"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS } from "../../utils/helpers";

export default function CustomDatePicker({
    selectedDate,
    onChange
}: {
    selectedDate: string;
    onChange: (date: string) => void
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        const formatted = `${year}-${month}-${d}`;

        onChange(formatted);
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const checkDate = new Date(year, month, d);
            const yearStr = checkDate.getFullYear();
            const monthStr = String(checkDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(d).padStart(2, '0');
            const dateString = `${yearStr}-${monthStr}-${dayStr}`;

            const isSelected = selectedDate === dateString;

            const now = new Date();
            const isToday = now.getDate() === d && now.getMonth() === month && now.getFullYear() === year;

            days.push(
                <button
                    key={d}
                    type="button"
                    onClick={() => handleDayClick(d)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
            ${isSelected ? 'bg-[#7A0018] text-white font-bold shadow-md' : 'text-slate-600 hover:bg-[#FAF8F5] hover:text-[#7A0018]'}
            ${isToday && !isSelected ? 'border border-[#7A0018]/50 text-[#7A0018]' : ''}
          `}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    const displayDate = selectedDate
        ? new Date(selectedDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
        : "";

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white border rounded-lg pl-12 pr-4 py-4 text-slate-800 cursor-pointer flex items-center transition-all group shadow-sm
          ${isOpen ? 'border-[#7A0018] ring-1 ring-[#7A0018]' : 'border-[#E8E1D9] hover:border-slate-300'}
        `}
            >
                <Calendar className={`absolute left-4 transition-colors ${isOpen ? 'text-[#7A0018]' : 'text-slate-400 group-hover:text-[#7A0018]'}`} size={20} />
                <span className={displayDate ? "text-slate-900 font-medium" : "text-slate-400"}>
                    {displayDate || "Seleziona data..."}
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 top-full mt-2 left-0 w-full md:w-80 bg-white border border-[#E8E1D9] rounded-xl shadow-2xl p-4 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8E1D9]">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-[#FAF8F5] rounded-full text-slate-400 hover:text-[#7A0018] transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-slate-800 font-serif text-lg capitalize">
                                {MONTHS[currentDate.getMonth()]} <span className="text-[#7A0018] font-luna ml-1">{currentDate.getFullYear()}</span>
                            </span>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-[#FAF8F5] rounded-full text-slate-400 hover:text-[#7A0018] transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* QUI HO APPLICATO LA CORREZIONE: ho aggiunto (day, index) e modificato la key */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, index) => (
                                <span key={`${day}-${index}`} className="text-xs font-bold text-slate-400">{day}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 place-items-center">
                            {renderCalendar()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}