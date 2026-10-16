# Menyiapkan login anggota dan berita (Supabase)

Website ini punya area anggota di `/admin`. Di sana anggota grup menulis berita, lalu admin menyetujuinya sebelum tayang di halaman News.
Selama Supabase belum disambungkan, website tetap jalan seperti biasa dan halaman News menampilkan berita contoh dari `src/data/news.ts`.

## Cara kerjanya

| Peran | Bisa apa |
| ----- | -------- |
| Pengunjung | Membaca berita yang sudah terbit. Tidak perlu login. |
| Anggota (`member`) | Login, menulis berita (dengan atau tanpa gambar), menyimpan draft, mengirim untuk disetujui, mengedit atau menghapus beritanya sendiri selama belum terbit. |
| Admin (`admin`) | Semua yang bisa dilakukan anggota, ditambah menyetujui (terbit), mengembalikan dengan catatan, menurunkan dan menghapus berita siapa pun. Admin juga bisa langsung menerbitkan beritanya sendiri. |

Status berita: **Draft**, lalu **Waiting for approval**, lalu **Published**. Kalau dikembalikan admin, statusnya menjadi **Needs changes** dan penulis melihat catatan admin.

Login memakai **email dan password**. Akun dibuatkan oleh admin di Supabase, jadi orang luar tidak bisa mendaftar sendiri. Setelah masuk, anggota bisa mengganti passwordnya sendiri di menu **Account**.

Aturan siapa boleh melakukan apa dijaga di database (Row Level Security di `supabase/schema.sql`), bukan hanya di tampilan website.

## Langkah setup (sekali saja)

### 1. Buat project Supabase

1. Daftar di <https://supabase.com>, sebaiknya dengan email grup atau email Pak Adhib, supaya datanya milik grup.
2. Klik **New project**. Isi nama (misalnya `cmd-website`), buat password database dan simpan baik-baik, lalu pilih region **Southeast Asia (Singapore)**.
3. Tunggu sampai project siap (sekitar 1–2 menit).

### 2. Buat tabel dan aturan akses

1. Di menu kiri, buka **SQL Editor**, lalu **New query**.
2. Salin seluruh isi file [`supabase/schema.sql`](supabase/schema.sql), tempel, lalu klik **Run**.
3. Pastikan muncul "Success. No rows returned".

### 3. Atur login

Di menu **Authentication**:

1. **Matikan pendaftaran publik.** Di pengaturan *Sign In / Providers*, matikan **Allow new users to sign up**. Pastikan provider **Email** tetap aktif.
2. **URL Configuration:** isi **Site URL** dengan `https://cmd-website-two.vercel.app` (atau domain website yang dipakai).

### 4. Sambungkan ke Vercel

1. Di Supabase, buka **Project Settings → API Keys** (atau **Connect**). Salin **Project URL** dan **Publishable key**. Kalau yang ada hanya *anon key*, itu juga bisa dipakai.
2. Di Vercel, buka project `cmd-website`, lalu **Settings → Environment Variables**. Tambahkan dua variabel ini untuk Production dan Preview:

   | Name | Value |
   | ---- | ----- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL, misalnya `https://abcd1234.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_…`) atau anon key |

   Kedua nilai ini memang boleh terlihat publik. Yang **tidak boleh** dimasukkan ke website adalah *secret key* atau *service_role key*.
3. Buka **Deployments**, klik titik tiga di deployment teratas, lalu pilih **Redeploy**.

Untuk mencoba di komputer sendiri, buat file `.env.local` berisi dua baris yang sama, lalu jalankan `npm run dev`.

### 5. Tambahkan anggota

Untuk setiap anggota grup:

1. Di Supabase, buka **Authentication → Users → Add user → Create new user**.
2. Isi email dan password awal (minimal 8 karakter), lalu centang **Auto Confirm User**.
3. Berikan email dan password itu ke anggota. Mereka login di `/login`, lalu sebaiknya langsung mengganti password di menu **Account**.

### Kalau anggota lupa password

Di **SQL Editor**, jalankan (ganti email dan password barunya):

```sql
update auth.users
set encrypted_password = extensions.crypt('PasswordBaru123', extensions.gen_salt('bf'))
where email = 'nama@mail.ugm.ac.id';
```

Berikan password baru itu ke anggota, lalu minta mereka menggantinya di menu **Account**.

### 6. Jadikan seseorang admin

Di **SQL Editor**, jalankan (ganti emailnya):

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'adhib@ugm.ac.id');
```

Untuk mencabut status admin, ganti `'admin'` dengan `'member'`.

SQL Editor selalu menulis "Success. No rows returned" untuk perintah `update` dan `insert`, dan itu normal. Untuk memeriksa hasilnya:

```sql
select u.email, p.full_name, p.role
from auth.users u
left join public.profiles p on p.id = u.id;
```

### 7. Atur nama yang tampil di dashboard (opsional)

Secara awal, nama diambil dari bagian depan email. Untuk mengubahnya:

```sql
update public.profiles
set full_name = 'Moh. Adhib Ulil Absor'
where id = (select id from auth.users where email = 'adhib@ugm.ac.id');
```

## Catatan

- **Gambar** disimpan di Supabase Storage (bucket `news-images`), maksimal 5 MB per gambar, format JPG, PNG, WebP atau GIF. Gambar lama otomatis dihapus kalau diganti atau beritanya dihapus.
- **Berita contoh** di `src/data/news.ts` tidak dipakai lagi setelah Supabase tersambung. Berita lama yang ingin dipertahankan bisa ditulis ulang lewat `/admin`.
- Setelah admin menyetujui berita, halaman News dan beranda langsung diperbarui.
