import { Link } from 'react-router-dom'
import LoginWomen from '../assets/imgs/login_women.svg'
import LoginMen from '../assets/imgs/login_men.svg'
import { LoginForm } from '../components/LoginForm'
import { GoogleAuthButton } from '../components/GoogleAuthButton'
import { useState, useEffect } from 'react'

import '../css/loginPage.css'

export default function LoginPage() {

  const [showDecoration, setShowDecoration] = useState(true)

  useEffect(() => {
    const updateShowDecoration = () => {
      if (window.innerWidth <= 1000) {
        setShowDecoration(false)
      } else {
        setShowDecoration(true)
      }
    }

    window.addEventListener('resize', updateShowDecoration)
    updateShowDecoration()

    return () => window.removeEventListener('resize', updateShowDecoration)
  }, [])

  return (
    <div className="login-page">
      {
        showDecoration && (
          <div className="images-section">
            <img src={LoginWomen} alt="Women" className="upper-image" />
            <img src={LoginMen} alt="Men" className="lower-image" />
          </div>
        )
      }
      <div className={`user-section ${!showDecoration ? 'user-section-complete' : ''}`}>
        <div className="login-section">
          <Link to="/" className="login-title">
            TRICER
          </Link>
          <LoginForm />
          <Link to="/password/reset" className="forget-password">
            Forget the password?
          </Link>
          <hr className="separator-line" />
          <div className="login-lower-section">
            <GoogleAuthButton />
          </div>
        </div>
        <div className="register-section">
          Don&apos;t have an account?
          <Link to="/register" className="sign-up">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}