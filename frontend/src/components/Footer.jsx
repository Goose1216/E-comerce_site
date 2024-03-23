import footerStyle from '../styles/MainWindow/FooterStyle.module.css'

const Footer = () => {
    return (
        <div className={footerStyle.FooterBlock}>
            <div className={footerStyle.FlexBlock}>
                <div className={footerStyle.InfoTelBlock}>
                    <ul>
                        <li>
                            © 2024 Компания STORE
                            <br/>
                            Все права защищены
                            <br/>
                            <br/>
                        </li>
                        <li>
                            <a href="#" target="_blank">8 (999) 999-99-99</a>
                            Москва
                        </li>
                    </ul>
                </div>
                <div className={footerStyle.AboutInfoBlock}>
                    <p>О компании</p>
                    <ul>
                        <li>
                            <a href="#">О нас</a>
                        </li>
                        <li>
                            <a href="#">Новости</a>
                        </li>
                    </ul>
                </div>
                <div className={footerStyle.AboutInfoBlock}>
                    <p>Бренды</p>
                    <ul>
                        <li>
                            <a href="#">Xerox</a>
                        </li>
                        <li>
                            <a href="#">Brother</a>
                        </li>
                        <li>
                            <a href="#">HP</a>
                        </li>
                        <li>
                            <a href="#">Canon</a>
                        </li>
                        <li>
                            <a href="#">Pantum</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;