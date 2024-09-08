import express, { Request, Response, NextFunction } from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.get("/", (req: Request, res: Response, _next: NextFunction) => {
  res.end()
})

app.post("/posts/pending", (req: Request, res: Response, _next: NextFunction) => {
  res.send(JSON.stringify({
    url: "http://example.com"
  }))
  res.end()
})

app.listen(process.env.PORT || 3000)
