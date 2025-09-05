import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

export function MarkdownExampleDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="ml-auto">
          Ver exemplos de Markdown
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Exemplos de Markdown</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold">Títulos e textos</h3>
              <p># Título H1</p>
              <p>## Título H2</p>
              <p>### Título H3</p>
              <p>Texto normal</p>
              <p>**negrito**</p>
              <p>*itálico*</p>
              <p>~~tachado~~</p>
              <p>`código inline`</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Divisão</h3>
              <p>---</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Checklist</h3>
              <p>[x] Tarefa concluída</p>
              <p>[ ] Tarefa pendente</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Links e imagens</h3>
              <p>Um link normal: [Google](https://google.com)</p>
              <br />
              <p>
                Imagem: ![Exemplo de
                Imagem](https://via.placeholder.com/300x150)
              </p>
              <br />
              <p>
                Um link com imagem:
                [![Placeholder](https://via.placeholder.com/100)](https://google.com)
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Listas</h3>
              <p>- Item não ordenado 1</p>
              <p>- Item não ordenado 2</p>
              <p className="ml-2">- Subitem</p>
              <p className="ml-2">- Outro subitem</p>
              <br />
              <p>1. Item ordenado 1</p>
              <p>2. Item ordenado 2</p>
              <p className="ml-2">1. Subitem numerado</p>
              <p className="ml-2">2. Outro subitem</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Citação</h3>
              <p>{">"} Isso é uma citação de exemplo.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Código</h3>
              <p>```js</p>
              <p>function hello() {"{"}</p>
              <p> console.log{'("Hello, Markdown!")'};</p>
              <p>{"}"}</p>
              <p>```</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Tabela</h3>
              <p>| Nome | Idade |</p>
              <p>|---------|-------|</p>
              <p>| João | 20 |</p>
              <p>| Maria | 25 |</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
