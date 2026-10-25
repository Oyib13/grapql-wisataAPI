<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database and Destinasi API

Create a local environment file and start MariaDB:

```bash
cp .env.example .env
docker compose up -d
```

Generate the Prisma Client, apply checked-in migrations, and start the API:

```bash
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Swagger UI is available at `http://localhost:3000/api` and the OpenAPI document at `http://localhost:3000/api-json`.

Available destination endpoints:

- `GET /destinasi` lists destinations; `?kategori=Pantai` filters by category.
- `GET /destinasi/:id` returns one destination.
- `POST /destinasi` creates a destination.
- `PATCH /destinasi/:id` updates supplied fields.
- `DELETE /destinasi/:id` deletes a destination and its related reviews/facilities.

Create a destination (JSON numeric values are required for `hargaTiket`):

```bash
curl -X POST http://localhost:3000/destinasi \
  -H "Content-Type: application/json" \
  -d '{"nama":"Pantai Kuta Mandalika","kategori":"Pantai","lokasi":"Lombok Tengah","hargaTiket":15000}'
```

The Prisma schema also defines `Ulasan` and `Fasilitas`, related to each destination. The MariaDB data is stored in the `mariadb_data` Docker volume. The sample credentials in `.env.example` are for local development only.

## GraphQL Ulasan

GraphQL tersedia di `/graphql`. Modul `Ulasan` menyediakan query untuk melihat semua ulasan, memfilter ulasan berdasarkan destinasi, dan mengambil satu ulasan berdasarkan ID. Mutasinya mendukung tambah, ubah rating/komentar, dan hapus ulasan. Nilai `ratingRata` destinasi dihitung ulang dalam transaksi setiap kali ulasan ditambah, diubah, atau dihapus. Rating harus bilangan bulat 1–5 dan komentar wajib sepanjang 1–191 karakter.

Daftar ulasan (parameter `destinasiId` opsional):

```graphql
query {
  ulasan(destinasiId: 1) {
    id
    destinasiId
    rating
    komentar
    createdAt
  }
}
```

Tambah ulasan:

```graphql
mutation {
  createUlasan(input: {
    destinasiId: 1
    rating: 5
    komentar: "Pemandangannya indah dan tempatnya bersih."
  }) {
    id
    destinasiId
    rating
    komentar
    createdAt
  }
}
```

Ubah rating atau komentar (field yang tidak dikirim tidak berubah):

```graphql
mutation {
  updateUlasan(id: 1, input: { rating: 4 }) {
    id
    rating
    komentar
  }
}
```

Hapus ulasan mengembalikan `true` jika berhasil. `ulasanById(id: 1)` mengambil satu ulasan; ID yang tidak ditemukan menghasilkan error GraphQL `NotFoundException`. `updateUlasan` hanya mengubah rating dan komentar, bukan memindahkan ulasan ke destinasi lain.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observer](https://observer.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
