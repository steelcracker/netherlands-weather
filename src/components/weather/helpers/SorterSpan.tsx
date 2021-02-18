export type SorterSpanOrder = 'none' | 'asc' | 'desc';

/** Simple sorting toggle icon ↓↑ */
const SorterSpan = ({
  children,
  order,
}: {
  children: React.ReactNode;
  order: SorterSpanOrder;
}) => {
  return (
    <div>
      {children} <span className={order === 'asc' ? 'active' : ''}>↓</span>
      <span className={order === 'desc' ? 'active' : ''}>↑</span>
    </div>
  );
};

export default SorterSpan;
