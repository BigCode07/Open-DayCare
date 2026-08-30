CREATE POLICY "users_select_own"
  ON users
  FOR SELECT
  USING (auth.uid() = id);
