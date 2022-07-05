import React, { Component } from "react";
import axios from "axios";
class Home extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      clients: [],
      redirect: false,
    };
  }
  componentDidMount() {
    axios
      .get("http://127.0.0.1:8000/api/clients", {
        headers: {
          // "x-access-token": token, // the token is a variable which holds the token
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({
          clients: res.data.data,
        });
      });
  }

  render() {
    return (
      <div>
        {/* <!-- Page Preloder --> */}
        <div id="preloder">
          <div className="loader"></div>
        </div>

        {/* <!-- Humberger Begin --> */}
        <div className="humberger__menu__overlay"></div>
        <div className="humberger__menu__wrapper">
          <div className="humberger__menu__logo">
            <a href="#">
              <img src="assets/img/logo.png" alt="" />
            </a>
          </div>
          <div className="humberger__menu__cart">
            <ul>
              <li>
                <a href="#">
                  <i className="fa fa-heart"></i> <span>1</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-shopping-bag"></i> <span>3</span>
                </a>
              </li>
            </ul>
            <div className="header__cart__price">
              item: <span>$150.00</span>
            </div>
          </div>
          <div className="humberger__menu__widget">
            <div className="header__top__right__language">
              <img src="assets/img/language.png" alt="" />
              <div>English</div>
              <span className="arrow_carrot-down"></span>
              <ul>
                <li>
                  <a href="#">Spanis</a>
                </li>
                <li>
                  <a href="#">English</a>
                </li>
              </ul>
            </div>
            <div className="header__top__right__auth">
              <a href="#">
                <i className="fa fa-user"></i> Login
              </a>
            </div>
          </div>
          <nav className="humberger__menu__nav mobile-menu">
            <ul>
              <li className="active">
                <a href="./index.html">Home</a>
              </li>
              <li>
                <a href="./shop-grid.html">Shop</a>
              </li>
              <li>
                <a href="#">Pages</a>
                <ul className="header__menu__dropdown">
                  <li>
                    <a href="./shop-details.html">Shop Details</a>
                  </li>
                  <li>
                    <a href="./shoping-cart.html">Shoping Cart</a>
                  </li>
                  <li>
                    <a href="./checkout.html">Check Out</a>
                  </li>
                  <li>
                    <a href="./blog-details.html">Blog Details</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="./blog.html">Blog</a>
              </li>
              <li>
                <a href="./contact.html">Contact</a>
              </li>
            </ul>
          </nav>
          <div id="mobile-menu-wrap"></div>
          <div className="header__top__right__social">
            <a href="#">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fa fa-linkedin"></i>
            </a>
            <a href="#">
              <i className="fa fa-pinterest-p"></i>
            </a>
          </div>
          <div className="humberger__menu__contact">
            <ul>
              <li>
                <i className="fa fa-envelope"></i> hello@colorlib.com
              </li>
              <li>Free Shipping for all Order of $99</li>
            </ul>
          </div>
        </div>
        {/* <!-- Humberger End -->

    <!-- Header Section Begin --> */}

        {/* <!-- Header Section End -->

    <!-- Hero Section Begin --> */}
        <div className="section-title">
          <h2>Catalogue des moutons</h2>
        </div>
        <div className="section-title">
          <h3>Annonces à valider</h3>
        </div>

        {/* <!-- Hero Section End -->

    <!-- Categories Section Begin --> */}
        <section className="categories">
          <div className="container">
            <div className="row">
              <div className="categories__slider owl-carousel">
                <div className="col-lg-3">
                  <div
                    className="categories__item set-bg"
                    data-setbg="img/categories/cat-1.jpg"
                  >
                    <h5>
                      <a href="#">Fresh Fruit</a>
                    </h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div
                    className="categories__item set-bg"
                    data-setbg="img/categories/cat-2.jpg"
                  >
                    <h5>
                      <a href="#">Dried Fruit</a>
                    </h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div
                    className="categories__item set-bg"
                    data-setbg="img/categories/cat-3.jpg"
                  >
                    <h5>
                      <a href="#">Vegetables</a>
                    </h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div
                    className="categories__item set-bg"
                    data-setbg="img/categories/cat-4.jpg"
                  >
                    <h5>
                      <a href="#">drink fruits</a>
                    </h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div
                    className="categories__item set-bg"
                    data-setbg="img/categories/cat-5.jpg"
                  >
                    <h5>
                      <a href="#">drink fruits</a>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Categories Section End -->

    <!-- Featured Section Begin --> */}
        <section className="featured spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title">
                  <h3>Annonces publiées</h3>
                </div>

                <div className="featured__controls">
                  <section className="hero">
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-9">
                          <div className="hero__search">
                            <div className="hero__search__form">
                              <form action="#">
                                <div className="hero__search__categories">
                                  All Categories
                                  <span className="arrow_carrot-down"></span>
                                </div>
                                <input
                                  type="text"
                                  placeholder="What do yo u need?"
                                />
                                <button type="submit" className="site-btn">
                                  SEARCH
                                </button>
                              </form>
                            </div>
                            <div className="hero__search__phone">
                              <div className="hero__search__phone__text"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div className="row featured__filter">
              {this.state.clients.map((clients) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mix fastfood vegetables">
                  <div className="featured__item">
                    <div
                      className="featured__item__pic set-bg"
                      data-setbg="img/featured/feature-8.jpg"
                    >
                      <ul className="featured__item__pic__hover">
                        <li>
                          <a href="#">
                            <i className="fa fa-heart"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa fa-retweet"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa fa-shopping-cart"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="featured__item__text">
                      <h6>
                        <a href="#">{clients.Nom}</a>
                      </h6>
                      <h5>{clients.CIN}</h5>
                    </div>
                  </div>
                </div>
              ))}
              {/* enddiv boucle */}
            </div>
          </div>
        </section>
        {/* <!-- Featured Section End -->

    <!-- Banner Begin --> */}
        {/* <div className="banner">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="banner__pic">
                  <img src="assets/img/banner/banner-1.jpg" alt="" />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="banner__pic">
                  <img src="assets/img/banner/banner-2.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* <!-- Banner End -->

    <!-- Latest Product Section Begin --> */}
        <section className="latest-product spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="latest-product__text">
                  {/* <h3>Latest Products</h3> */}
                  <div className="latest-product__slider owl-carousel">
                    <div className="latest-prdouct__slider__item">
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-1.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-2.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-3.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                    </div>
                    <div className="latest-prdouct__slider__item">
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-1.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-2.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-3.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
         

              <div className="col-lg-6 col-md-6">
                <div className="latest-product__text">
                  {/* <h4>Latest Products</h4> */}
                  <div className="latest-product__slider owl-carousel">
                    <div className="latest-prdouct__slider__item">
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-1.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-2.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-3.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                    </div>
                    <div className="latest-prdouct__slider__item">
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-1.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-2.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                      <a href="#" className="latest-product__item">
                        <div className="latest-product__item__pic">
                          <img
                            src="assets/img/latest-product/lp-3.jpg"
                            alt=""
                          />
                        </div>
                        <div className="latest-product__item__text">
                          <h6>Crab Pool Security</h6>
                          <span>$30.00</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
         


            </div>
          </div>
        </section>
        {/* <!-- Latest Product Section End -->

    <!-- Blog Section Begin --> */}
        {/* <section className="from-blog spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title from-blog__title">
                  <h2>From The Blog</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="blog__item">
                  <div className="blog__item__pic">
                    <img src="assets/img/blog/blog-1.jpg" alt="" />
                  </div>
                  <div className="blog__item__text">
                    <ul>
                      <li>
                        <i className="fa fa-calendar-o"></i> May 4,2019
                      </li>
                      <li>
                        <i className="fa fa-comment-o"></i> 5
                      </li>
                    </ul>
                    <h5>
                      <a href="#">Cooking tips make cooking simple</a>
                    </h5>
                    <p>
                      Sed quia non numquam modi tempora indunt ut labore et
                      dolore magnam aliquam quaerat{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="blog__item">
                  <div className="blog__item__pic">
                    <img src="assets/img/blog/blog-2.jpg" alt="" />
                  </div>
                  <div className="blog__item__text">
                    <ul>
                      <li>
                        <i className="fa fa-calendar-o"></i> May 4,2019
                      </li>
                      <li>
                        <i className="fa fa-comment-o"></i> 5
                      </li>
                    </ul>
                    <h5>
                      <a href="#">6 ways to prepare breakfast for 30</a>
                    </h5>
                    <p>
                      Sed quia non numquam modi tempora indunt ut labore et
                      dolore magnam aliquam quaerat{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="blog__item">
                  <div className="blog__item__pic">
                    <img src="assets/img/blog/blog-3.jpg" alt="" />
                  </div>
                  <div className="blog__item__text">
                    <ul>
                      <li>
                        <i className="fa fa-calendar-o"></i> May 4,2019
                      </li>
                      <li>
                        <i className="fa fa-comment-o"></i> 5
                      </li>
                    </ul>
                    <h5>
                      <a href="#">Visit the clean farm in the US</a>
                    </h5>
                    <p>
                      Sed quia non numquam modi tempora indunt ut labore et
                      dolore magnam aliquam quaerat{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        {/* <!-- Blog Section End -->

    <!-- Footer Section Begin --> */}
      </div>
    );
  }
}

export default Home;
