const Joi = require("joi");
const { jobs, resources } = require("../models");

exports.addJob = async (req, res) => {
  const { position, company, description, location, status, image, sources } = req.body;

  const schema = Joi.object({
    position: Joi.string(),
    company: Joi.string(),
    description: Joi.string(),
    location: Joi.string(),
    status: Joi.string(),
    image: Joi.string(),
    sources: Joi.array().items(
      Joi.object({
        source: Joi.string().required(),
      })
    ),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const jobPayload = {
      position,
      company,
      description,
      location,
      status,
      image,
    };

    const job = await jobs.create(jobPayload);

    if (sources) {
      if (sources.length > 0) {
        await Promise.all(
          sources.map(async ({ source }) => {
            return await resources.create({ jobId: job.id, resource: source });
          })
        );
      }
    }

    res.send({
      status: "Success",
      message: "Success add job data",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

exports.getJobs = async (req, res) => {
  const { description, location, full_time, page, limit = 10 } = req.query;

  const schema = Joi.object({
    page: Joi.number().required(),
    limit: Joi.number(),
    description: Joi.string(),
    location: Joi.string(),
    full_time: Joi.bool(),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const offset = (+page - 1) * +limit;

    const where = {};
    if (description) where.description = description;
    if (location) where.location = location;
    if (full_time) where.status = "Full Time";

    const jobData = await jobs.findAll({
      where,
      limit: +limit,
      offset,
    });

    res.send({
      status: "Success",
      message: "Success get list jobs",
      data: jobData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

exports.getJob = async (req, res) => {
  const { id } = req.params;

  const schema = Joi.object({
    id: Joi.number(),
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    let jobDetail = await jobs.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const resourceData = await resources.findAll({
      where: {
        jobId: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    jobDetail = JSON.parse(JSON.stringify(jobDetail));

    res.send({
      status: "Success",
      message: "Success get list jobs",
      data: {
        ...jobDetail,
        sources: resourceData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};
