import blockStyle from '../../styles/MainWindow/BlockStyle.module.css'
import Product from '../../img/Product.jpg'

const Block = ({ title, description, price}) => {
  return (
    <div className={blockStyle.Block}>
      <img className={blockStyle.IMG} src={Product} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{price}</span>
    </div>
  );
};

export default Block;
