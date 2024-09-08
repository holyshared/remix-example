import express, { Request, Response, NextFunction } from "express"

const app = express()

app.use(express.json())

app.get("/", (req: Request, res: Response, _next: NextFunction) => {
  res.end()
})

app.post("/posts/pending", (req: Request, res: Response, _next: NextFunction) => {
  res.end()
})

app.listen(process.env.PORT || 3000)
