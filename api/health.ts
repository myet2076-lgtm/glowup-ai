type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default function handler(_req: unknown, res: ResponseLike): void {
  const configured = Boolean(process.env.OPENAI_API_KEY);
  res.setHeader('Cache-Control', 'no-store');
  res.status(configured ? 200 : 503).json({
    status: configured ? 'ok' : 'configuration_required',
    services: { openai: configured },
  });
}
