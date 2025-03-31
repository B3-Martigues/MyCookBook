import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUtensils, faStar } from "@fortawesome/free-solid-svg-icons";
import ListRecipes from "../organisms/ListRecipes";
import "../../styles/organisms/ListRecipes.css";
import "../../styles/pages/Home.css";

const Home = () => {
  return (
    <>
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-header">
            <h1 className="hero-title">L'art de la cuisine fait maison</h1>
            <p className="hero-description">
              Découvrez des recettes authentiques et partagez vos créations
              culinaires avec une communauté passionnée.
            </p>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">1,500+</span>
                <span className="stat-label">Recettes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15k+</span>
                <span className="stat-label">Membres</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="recipes-section">
        <div className="section-header">
          <h2 className="section-title">Nos dernières recettes</h2>
        </div>
        <ListRecipes />
      </section>
    </>
  );
};

export default Home;
