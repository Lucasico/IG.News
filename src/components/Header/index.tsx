import styles from "./styles.module.scss";
export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        {/**
         *
         * A importação das imagens no next é diferente do padrão do react
         * 1º ela(imgs) sempre deve estar dentro da pasta public
         * 2º deve-se importa-las dentro do src iniciando sempre com /
         */}
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <a className={styles.active}>Home</a>
          <a>Posts</a>
        </nav>
      </div>
    </header>
  );
}
