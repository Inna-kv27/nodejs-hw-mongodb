export const getEnvVar = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Environment variable ${name} is not defined. Please set it in .env file or environment.`,
    );
    process.exit(1);
  }
  return value;
};
