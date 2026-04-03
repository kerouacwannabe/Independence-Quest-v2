type Props = { nextMove: { type: string; heading: string; copy: string; button: string }; onOpenQuests: () => void };

export function NextMoveCard({ nextMove, onOpenQuests }: Props) {
  return (
    <section className="card next-move-card">
      <p className="eyebrow">{nextMove.type}</p>
      <h3>{nextMove.heading}</h3>
      <p>{nextMove.copy}</p>
      <button className="primary-button" onClick={onOpenQuests}>{nextMove.button}</button>
    </section>
  );
}
