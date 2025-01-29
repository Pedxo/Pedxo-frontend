import emptyImage from "../assets/images/searchingdoc.png";
import Button from "./Button";
function EmptyPage({ image, title, text, icon, to, btnText }) {
  return (
    <div className="flex items-center p-3 justify-center text-center flex-col gap-4">
      <img className="max-w-96 flex-shrink-0" src={image || emptyImage} alt="empty_image" />
      <h2 className="text-lg lg:text-2xl font-semibold">{title}</h2>
      <p className="text-sm text-black/50">{text}</p>
      <Button link linkTo={to} iconLeft={icon} type="primary">{btnText}</Button>
    </div>
  );
}

export default EmptyPage;
