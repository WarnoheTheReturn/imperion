import styles from './Button.module.css';

function Button({onClick, name} : {onClick: () => void, name: string}) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
        >
            {name}
        </button>
    );
}

export default Button;