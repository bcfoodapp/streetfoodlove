package main

type Backend struct {
	*Database
}

func (b *Backend) Close() error {
	return b.Database.Close()
}

func (b *Backend) Vendor(id UUID) (*Vendor, error) {
	return b.Database.Vendor(id)
}
