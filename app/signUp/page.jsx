"use client"
import { useEffect, useState } from 'react'
import { signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const Auth = () => {

  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(false);


  const initialState = {
    username: "",
    password: "",
    email: "",
  };


  const [data, setData] = useState(initialState);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })
  }, [])


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }


  const resetForm = () => {
    setData(initialState);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        let res = await fetch('/api/auth/new', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": 'application/json',
            Authorization: `JWT ${localStorage.getItem('token') || ""}`
          },
        });
        let result = await res.json();
        if (result.success) {
          localStorage.setItem('token', result.token);
          router.refresh();
          router.push('/');
        }
      } else {

        let res = await fetch('/api/auth/login', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": 'application/json',
            Authorization: `JWT ${localStorage.getItem('token') || ""}`
          },
        });


        let result = await res.json();
        if (result.success) {
          localStorage.setItem('token', result.token);
          router.refresh();
          router.push('/');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='flex align-middle justify-center  gap-4 relative !bg-[length:200%_200%] '>
      <div className='flex align-middle justify-center '>
        <form className='flex flex-col justify-center align-middle gap-2 bg-rose-100 rounded-2xl p-4'
          onSubmit={handleSubmit} encType="multipart/form-data">
          <h3 className='text-center font-satoshi text-lg font-medium'>{isSignUp ? "Register" : "Login"}</h3>

          {isSignUp && (
            <div className='form_div'>
              <input
                required
                type="text"
                placeholder="Name"
                className='input'
                name="username"
                value={data.username}
                onChange={handleChange}
              />
            </div>
          )}

          <div className='form_div'>
            <input
              required
              type="email"
              placeholder="Email"
              className='input'
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className='form_div'>
            <input
              required
              type="password"
              className='input'
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col'>

            <button
              className='auth_btn'
              type="Submit"
            >
              {isSignUp ? "SignUp" : "Login"}
            </button>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className='auth_btn'
                >
                  Google
                </button>
              ))}

            <span
              className='cursor-pointer text-xs decoration-solid
                underline flex justify-end'
              onClick={() => {
                resetForm();
                setIsSignUp((prev) => !prev);

              }}
            >
              {isSignUp
                ? "Already have an account ? Login"
                : "Don't have an account ? Sign up"}
            </span>
          </div>
          <div>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Auth