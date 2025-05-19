from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, Uuzhan"}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": 'it worked'}

@app.post("/items/")
def create_item(name: str):
    return {"message": f"Item '{name}' created."}

@app.put("/items/{item_id}")
def update_item(item_id: int, name: str):
    return {"message": f"Item {item_id} updated to '{name}'."}

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    return {"message": f"Item {item_id} deleted."}