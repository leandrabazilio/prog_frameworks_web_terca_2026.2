const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");
const AlunoEmailDuplicadoError = require("../errors/AlunoEmailDuplicadoError");

class AlunoService{

    async findMany(page, pageSize, orderBy, order){
        //SELECT * FROM ALUNOS
        const alunos = await prisma.aluno.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize),
            orderBy: {
                [orderBy]: order
            }
        });

        const total = await prisma.aluno.count();

        return {
            alunos,
            total
        };
    }

    async findById(id){
        const aluno = await prisma.aluno.findUnique({
            where: {
                id: Number(id)
            }
        });

        if(!aluno){
            throw new AlunoNaoEncontradoError();
        }

        return aluno;
    }

    async update(id, aluno){
        const alunoExistente = await prisma.aluno.findUnique({
            where: {
                id: Number(id)
            }
        });

        if(!alunoExistente){
            throw new AlunoNaoEncontradoError();
        }

        const {nome, email} = aluno;

        if(!nome || !email){
            throw new AlunoInvalidoError();
        }

        const emailExistente = await prisma.aluno.findFirst({
            where: {
                email: email,
                NOT: {
                    id: Number(id)
                }
            }
        });

        if(emailExistente){
            throw new AlunoEmailDuplicadoError();
        }

        const alunoAtualizado = await prisma.aluno.update({
            where: {
                id: Number(id)
            },
            data: aluno
        });

        return alunoAtualizado;
    }

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }
        //create = insert
        //update = update
        //delete = delete
        //findMany = select * from
        const novoAluno = await prisma.aluno.create({data:aluno});

        return novoAluno;
    }
}

module.exports = new AlunoService();