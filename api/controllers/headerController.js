const Header = require("./../modle/Header");

exports.createHeader = async (req, res) => {
  try {
    const { links } = req.body;
    const parsedLinks = JSON.parse(links);

    const newHeader = new Header({
      logo: req.files?.logo?.[0]?.path || "",
      playstore: req.files?.playstore?.[0]?.path || "",
      links: parsedLinks,
    });

    await newHeader.save();
    res.status(201).json({ success: true, header: newHeader });
  } catch (error) {
    console.error("Create Header Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getHeader = async (req, res) => {
  try {
    const headers = await Header.find().sort({ createdAt: -1 });
    res.json({ success: true, header: headers[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateHeader = async (req, res) => {
  try {
    const { links } = req.body;
    const parsedLinks = JSON.parse(links);
    const { id } = req.params;

    const updatedHeader = await Header.findByIdAndUpdate(
      id,
      {
        logo: req.files?.logo?.[0]?.path || undefined,
        playstore: req.files?.playstore?.[0]?.path || undefined,
        links: parsedLinks,
      },
      { new: true }
    );

    res.json({ success: true, header: updatedHeader });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update Failed" });
  }
};

exports.deleteHeader = async (req, res) => {
  try {
    const { id } = req.params;
    await Header.findByIdAndDelete(id);
    res.json({ success: true, message: "Header deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete Failed" });
  }
};
