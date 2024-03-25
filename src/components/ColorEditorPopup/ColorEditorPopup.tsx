import './ColorEditorPopup.css';

export const ColorEditorPopup = (props: { changeColor: (color: string) => void }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.changeColor(e.target.value);
  };

  return (
    <div className="popup">
      <p>Choose a new color for a ball:</p>
      <input className="popup__input" type="color" name="color" id="color" onBlur={onChange} />
    </div>
  );
};
