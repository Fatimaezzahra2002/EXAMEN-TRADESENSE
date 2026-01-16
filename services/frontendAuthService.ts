// Service d'authentification frontend qui communique avec le backend
export class FrontendAuthService {
  private static readonly BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fonction de login qui appelle le backend
  static async login(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log('Attempting login with:', email);
      
      const response = await fetch(`${this.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      
      let result: any;
      try {
        result = await response.json();
      } catch {
        const text = await response.text();
        console.error('Login response is not valid JSON:', text);
        if (!response.ok) {
          return { success: false, error: `HTTP error ${response.status}` };
        }
        return { success: false, error: 'Unexpected login response' };
      }

      console.log('Login result body:', result);

      if (!response.ok) {
        return {
          success: false,
          error: result?.error || `HTTP error ${response.status}`
        };
      }
      
      return result;
    } catch (error) {
      console.error('Network error during login:', error);
      // Fallback to demo credentials if backend is not accessible
      if (email === 'demo@example.com' && password === 'demo123') {
        return {
          success: true,
          user: {
            id: 1,
            email: 'demo@example.com',
            name: 'Demo User',
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
      }
      return { success: false, error: 'Connection failed - using offline mode' };
    }
  }

  // Fonction d'enregistrement qui appelle le backend
  static async register(name: string, email: string, password: string): Promise<{ success: boolean; userId?: number; error?: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      let result: any;
      try {
        result = await response.json();
      } catch {
        const text = await response.text();
        console.error('Registration response is not valid JSON:', text);
        if (!response.ok) {
          return { success: false, error: `HTTP error ${response.status}` };
        }
        return { success: false, error: 'Unexpected registration response' };
      }

      if (!response.ok) {
        console.error('Registration request failed with status', response.status, 'body:', result);
        return {
          success: false,
          error: result?.error || `HTTP error ${response.status}`
        };
      }

      console.log('Registration result:', result);
      return result;
    } catch (error) {
      console.error('Network error during registration:', error);
      // Fallback to demo registration if backend is not accessible
      if (email === 'demo@example.com' && password === 'demo123') {
        return { success: true, userId: 1 };
      }
      return { success: false, error: 'Connection failed - using offline mode' };
    }
  }
}
