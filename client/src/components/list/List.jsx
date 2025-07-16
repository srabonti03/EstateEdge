import "./list.scss";
import Card from "../card/Card";

function List({ items = [] }) {
  if (!Array.isArray(items)) {
    return <div className="list">No items to show.</div>;
  }

  return (
    <div className="list">
      {items.length > 0 ? (
        items.map((item) => <Card key={item.id} item={item} />)
      ) : (
        <p className="noResults">No posts found.</p>
      )}
    </div>
  );
}

export default List;
