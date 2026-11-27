import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { authApi } from "../api/endpoints";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authApi.login(username, password);
      login(data.token, data.username, data.role);
      navigate("/");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <Dumbbell className="text-primary-text" size={24} />
          <span className="font-semibold text-xl text-foreground">
            FitManager
          </span>
        </div>
        <h1 className="text-lg font-medium text-foreground mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="username">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              placeholder="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="password">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="password"
              required
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p role="alert" className="text-xs text-muted mt-4">
          Demo: admin / admin123 or staff / staff123
        </p>
      </Card>
    </div>
  );
}
