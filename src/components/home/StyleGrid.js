export default function StyleGrid({ collections }) {
  return (
    <section className="kolekcie-wrapper" style={{ padding: '50px 0', backgroundColor: '#000', color: '#fff' }}>
      <div className="nadpis-sekcie" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>Vyberte si kolekciu podľa štýlu vášho domu</h2>
        <p style={{ color: '#ccc' }}>Každá kolekcia má vlastný charakter, cenu a dizajnový smer.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        width: '90%',
        margin: '0 auto'
      }}>
        {collections.map((col) => (
          <div key={col.id} className="karta" style={{ backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
              height: '250px',
              backgroundImage: col.mainImage ? `url('${col.mainImage}')` : 'none',
              backgroundColor: '#222', // Темный фон-заглушка, если фото грузится
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.5rem' }}>{col.title}</h3>
              <p style={{ color: '#aaa', margin: '10px 0' }}>{col.subtitle}</p>
              <a href={`/kolekcia/${col.slug}`} style={{
                display: 'inline-block',
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#fff',
                color: '#000',
                textDecoration: 'none',
                fontWeight: 'bold',
                borderRadius: '4px'
              }}>
                Zobraziť kolekciu
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}