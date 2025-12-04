const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const projects = [
    {
        title: "Projeto Fotografia Urbana",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60",
        description: "Uma exploração das cores e formas da cidade moderna.",
        fullDescription: "Este projeto captura a essência da vida urbana através de uma série de fotografias de longa exposição e alto contraste. O objetivo foi destacar a beleza caótica das metrópoles.",
        images: [
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop&q=60"
        ]
    },
    {
        title: "Design de Interface Minimalista",
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
        description: "Conceito de UI para um aplicativo de produtividade.",
        fullDescription: "Focado na usabilidade e na redução de carga cognitiva, este design utiliza espaços em branco e tipografia forte para guiar o usuário.",
        images: [
            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60"
        ]
    },
    {
        title: "Identidade Visual: Natureza",
        thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60",
        description: "Branding para uma marca de produtos orgânicos.",
        fullDescription: "A paleta de cores foi inspirada em tons terrosos e folhagens, transmitindo sustentabilidade e frescor.",
        images: [
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60"
        ]
    },
    {
        title: "Ilustração Digital",
        thumbnail: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60",
        description: "Série de ilustrações vetoriais abstratas.",
        fullDescription: "Explorando formas geométricas e gradientes vibrantes para criar composições dinâmicas.",
        images: [
            "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
        ]
    }
];

async function main() {
    console.log('Start seeding ...');
    for (const p of projects) {
        const project = await prisma.project.create({
            data: {
                title: p.title,
                thumbnail: p.thumbnail,
                description: p.description,
                fullDescription: p.fullDescription,
                images: JSON.stringify(p.images)
            }
        });
        console.log(`Created project with id: ${project.id}`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
