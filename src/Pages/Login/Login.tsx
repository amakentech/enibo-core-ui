import { FC, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { useAppState } from "@/store/state";
import { LOGIN_MUTATION } from "@/types/mutations";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(8, { message: "Password is required" }),
});

type LoginInput = z.infer<typeof LoginSchema>;

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to hold the error message
  const { appState, setAppState } = useAppState();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || { pathname: "/dashboard" };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  // const getUserData = async () => {
  //   //cors headers
  //   const userData = await fetch("http://ip-api.com/json/", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       return data;
  //     });
  //   return userData;
  // };

  // useEffect(() => {
  //   console.log(getUserData());
  // }, []);

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data && data.authenticate && data.authenticate.token) {
        localStorage.setItem("token", data.authenticate.token);
        localStorage.setItem("user", JSON.stringify(data.authenticate.user));
        setAppState({
          ...appState,
          user: {
            ...data.authenticate.user,
          },
        });
        setIsLoading(false);
        navigate(from, { replace: true });
      } else {
        setError("Login failed. Please check your credentials.");
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.log("Log error", error);
      setError(`${error.message}. Sign up or try again.`);
      setIsLoading(false);
    },
  });

  const onSubmit = (data: LoginInput) => {
    setIsLoading(true);
    setError(null); // Reset error state
    loginMutation({ variables: data });
  };

  return (
    <section className="flex items-center justify-center h-screen align-middle">
      <Card className="w-[30%]">
        <CardHeader></CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div className="flex justify-center">
              <Logo />
            </div>
            {error && <div className="text-center text-red-500">{error}</div>}{" "}
            {/* Display error message */}
            <div className="flex flex-col gap-4">
              <div>
                <Label
                  htmlFor="email"
                  className="space-y-2 text-base text-[#36459C]"
                >
                  Email
                </Label>
                <Input
                  {...register("email")}
                  placeholder="Your email"
                  type="email"
                  className="h-12 text-base bg-blue-50"
                  autoComplete="false"
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="text-base text-[#36459C]">
                  Password
                </Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="h-12 text-base bg-blue-50"
                  autoComplete="false"
                />
                {errors.password && (
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                className="h-12 w-full bg-[#36459C] text-base uppercase hover:bg-[#253285]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <Link to="/" className="text-[#36459C] hover:text-[#253285]">
                Forgot Password?
              </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </section>
  );
};

export default Login;
