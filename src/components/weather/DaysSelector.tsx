import { useMemo } from 'react';

/** Renders 7 upcoming days picker */
const DaysSelector = ({
  selectedDateIndex,
  setDateIndex,
}: {
  selectedDateIndex: number;
  setDateIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const days = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const newDate = new Date();
      newDate.setDate(now.getDate() + i);
      days.push(newDate);
    }
    return days;
  }, []);

  return (
    <ul className="days">
      {days.map((day, index) => {
        let className = '';
        if (index === selectedDateIndex) className += 'active';
        return (
          <li key={index}>
            <button className={className} onClick={() => setDateIndex(index)}>
              {`${day.toString().slice(0, 3)} ${day.getDate()}-${
                day.getMonth() + 1
              }`}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default DaysSelector;
